import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

import { User, UserDocument } from '../schemas/user.schema.js';
import {
  AuthorProfile,
  AuthorProfileDocument,
} from '../../authors/schemas/author-profile.schema.js';
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { ChangePasswordDto } from '../dto/change-password.dto.js';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto.js';
import { escapeRegex } from '../../../common/utils/regex.utils.js';
import { RolesService } from '../../roles/services/roles.service.js';
import { RoleType } from '../../roles/schemas/role.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(AuthorProfile.name)
    private readonly authorProfileModel: Model<AuthorProfileDocument>,
    private readonly rolesService: RolesService,
  ) {}

  async findAll(page = 1, limit = 20) {
    const pageNum = Math.max(1, page);
    const limitNum = Math.max(1, Math.min(limit, 100));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      this.userModel
        .find()
        .select('-password')
        .populate('roleId', 'name description isActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
        .exec(),
      this.userModel.countDocuments(),
    ]);

    return {
      success: true,
      message: 'Lấy danh sách người dùng thành công',
      data: {
        users,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .populate('roleId', 'name description isActive')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const authorProfile = await this.authorProfileModel
      .findOne({ userId: user._id })
      .select('-userId -__v')
      .lean()
      .exec();

    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: {
        user: {
          ...user,
          authorProfile: authorProfile || null,
        },
      },
    };
  }

  async findByIdentifier(identifier: string) {
    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      throw new BadRequestException('Định danh người dùng không hợp lệ');
    }

    const normalizedUsername = cleanIdentifier.startsWith('@')
      ? cleanIdentifier.slice(1).toLowerCase()
      : cleanIdentifier.toLowerCase();

    let user: any = null;
    let authorProfile: any = null;

    // 1. Nếu là ObjectId hợp lệ -> Tìm theo _id trước
    if (Types.ObjectId.isValid(cleanIdentifier)) {
      user = await this.userModel
        .findById(cleanIdentifier)
        .select('-password -tokenVersion')
        .populate('roleId', 'name description isActive')
        .lean()
        .exec();
    }

    // 2. Nếu không tìm thấy theo id -> Tìm theo username
    if (!user) {
      user = await this.userModel
        .findOne({ username: normalizedUsername })
        .select('-password -tokenVersion')
        .populate('roleId', 'name description isActive')
        .lean()
        .exec();
    }

    // 3. Nếu vẫn không thấy -> Tìm trong AuthorProfile theo bút danh penName
    if (!user) {
      authorProfile = await this.authorProfileModel
        .findOne({
          penName: { $regex: new RegExp(`^${escapeRegex(cleanIdentifier)}$`, 'i') },
          isActive: true,
        })
        .lean()
        .exec();

      if (authorProfile) {
        user = await this.userModel
          .findById(authorProfile.userId)
          .select('-password -tokenVersion')
          .populate('roleId', 'name description isActive')
          .lean()
          .exec();
      }
    }

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng hoặc tác giả này');
    }

    if (!user.isActive) {
      throw new NotFoundException('Tài khoản này hiện không khả dụng');
    }

    // 4. Nếu chưa lấy authorProfile thì truy vấn xem user này có profile tác giả không
    if (!authorProfile) {
      authorProfile = await this.authorProfileModel
        .findOne({ userId: user._id, isActive: true })
        .select('-userId -__v')
        .lean()
        .exec();
    } else {
      delete authorProfile.userId;
      delete authorProfile.__v;
    }

    const roleName =
      typeof user.roleId === 'object' && user.roleId?.name
        ? user.roleId.name
        : 'USER';

    const publicUser = {
      _id: user._id,
      username: user.username,
      displayName: user.displayName || user.username,
      avatar: user.avatar || '',
      bio: user.bio || '',
      socialLinks: user.socialLinks || {},
      role: roleName,
      createdAt: user.createdAt,
      authorProfile: authorProfile || null,
    };

    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: {
        user: publicUser,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (dto.displayName !== undefined) {
      user.displayName = dto.displayName.trim();
    }
    if (dto.avatar !== undefined) {
      user.avatar = dto.avatar.trim();
    }
    if (dto.bio !== undefined) {
      user.bio = dto.bio.trim();
    }
    if (dto.socialLinks !== undefined) {
      user.socialLinks = {
        facebook: dto.socialLinks.facebook?.trim() || '',
        twitter: dto.socialLinks.twitter?.trim() || '',
      };
    }

    await user.save();

    const updatedUser = await this.userModel
      .findById(userId)
      .select('-password')
      .populate('roleId', 'name description isActive')
      .lean()
      .exec();

    return {
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      data: {
        user: updatedUser,
      },
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu hiện tại');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    return {
      success: true,
      message: 'Đổi mật khẩu thành công. Các phiên đăng nhập khác đã được thu hồi.',
      data: null,
    };
  }

  async updateRole(adminUserId: string, targetUserId: string, roleName: RoleType) {
    if (!Types.ObjectId.isValid(targetUserId)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    if (adminUserId && targetUserId === adminUserId) {
      throw new BadRequestException('Không thể tự thay đổi vai trò của chính mình');
    }

    if (roleName === RoleType.AUTHOR) {
      throw new BadRequestException(
        'Không được phép gán vai trò Tác giả (AUTHOR). Người dùng tự nâng cấp lên tác giả qua quy trình đăng ký riêng.',
      );
    }

    const allowedRoles = [RoleType.USER, RoleType.MANAGER, RoleType.ADMIN];
    if (!allowedRoles.includes(roleName)) {
      throw new BadRequestException(
        'Vai trò không hợp lệ. Admin chỉ được chuyển đổi giữa: USER, MANAGER, ADMIN.',
      );
    }

    const user = await this.userModel.findById(targetUserId).exec();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const roleDoc = await this.rolesService.findByName(roleName);
    if (!roleDoc) {
      throw new NotFoundException(`Không tìm thấy vai trò ${roleName} trong hệ thống`);
    }

    user.roleId = roleDoc._id;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    const updatedUser = await this.userModel
      .findById(targetUserId)
      .select('-password')
      .populate('roleId', 'name description isActive')
      .lean()
      .exec();

    return {
      success: true,
      message: `Đã cập nhật vai trò người dùng thành ${roleName}`,
      data: { user: updatedUser },
    };
  }

  async updateStatus(adminUserId: string, targetUserId: string, isActive: boolean) {
    if (!Types.ObjectId.isValid(targetUserId)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    if (adminUserId && targetUserId === adminUserId && !isActive) {
      throw new BadRequestException('Không thể tự khóa tài khoản quản trị của chính mình');
    }

    const user = await this.userModel.findById(targetUserId).exec();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    user.isActive = isActive;
    if (!isActive) {
      user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    }
    await user.save();

    const updatedUser = await this.userModel
      .findById(targetUserId)
      .select('-password')
      .populate('roleId', 'name description isActive')
      .lean()
      .exec();

    return {
      success: true,
      message: isActive ? 'Đã kích hoạt tài khoản' : 'Đã khóa tài khoản thành công',
      data: { user: updatedUser },
    };
  }

  async adminUpdateUser(adminUserId: string, targetUserId: string, dto: AdminUpdateUserDto) {
    if (!Types.ObjectId.isValid(targetUserId)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    const user = await this.userModel.findById(targetUserId).exec();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (dto.role) {
      if (adminUserId && targetUserId === adminUserId) {
        throw new BadRequestException('Không thể tự thay đổi vai trò của chính mình');
      }

      if (dto.role === RoleType.AUTHOR) {
        throw new BadRequestException(
          'Không được phép gán vai trò Tác giả (AUTHOR). Người dùng tự nâng cấp lên tác giả qua quy trình đăng ký riêng.',
        );
      }

      const allowedRoles = [RoleType.USER, RoleType.MANAGER, RoleType.ADMIN];
      if (!allowedRoles.includes(dto.role)) {
        throw new BadRequestException(
          'Vai trò không hợp lệ. Admin chỉ được chuyển đổi giữa: USER, MANAGER, ADMIN.',
        );
      }

      const roleDoc = await this.rolesService.findByName(dto.role);
      if (!roleDoc) {
        throw new NotFoundException(`Không tìm thấy vai trò ${dto.role} trong hệ thống`);
      }
      user.roleId = roleDoc._id;
      user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    }

    if (dto.isActive !== undefined) {
      if (adminUserId && targetUserId === adminUserId && !dto.isActive) {
        throw new BadRequestException('Không thể tự khóa tài khoản quản trị của chính mình');
      }
      user.isActive = dto.isActive;
      if (!dto.isActive) {
        user.tokenVersion = (user.tokenVersion ?? 0) + 1;
      }
    }

    if (dto.displayName !== undefined) {
      user.displayName = dto.displayName.trim();
    }
    if (dto.bio !== undefined) {
      user.bio = dto.bio.trim();
    }

    await user.save();

    const updatedUser = await this.userModel
      .findById(targetUserId)
      .select('-password')
      .populate('roleId', 'name description isActive')
      .lean()
      .exec();

    return {
      success: true,
      message: 'Cập nhật tài khoản người dùng thành công',
      data: { user: updatedUser },
    };
  }

  async getOverviewStats() {
    const [totalUsers, activeUsers, lockedUsers] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.userModel.countDocuments({ isActive: true }).exec(),
      this.userModel.countDocuments({ isActive: false }).exec(),
    ]);

    return {
      success: true,
      message: 'Lấy dữ liệu thống kê tổng quan người dùng thành công',
      data: {
        totalUsers,
        activeUsers,
        lockedUsers,
      },
    };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate('roleId', 'name description isActive')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: { user },
    };
  }
}
