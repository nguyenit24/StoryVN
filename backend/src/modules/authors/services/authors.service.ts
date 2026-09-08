import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AuthorProfile, AuthorProfileDocument } from '../schemas/author-profile.schema.js';
import { User, UserDocument } from '../../users/schemas/user.schema.js';
import { RolesService } from '../../roles/services/roles.service.js';
import { RoleType } from '../../roles/schemas/role.schema.js';
import { AuthService } from '../../auth/services/auth.service.js';
import { UpgradeAuthorDto } from '../dto/upgrade-author.dto.js';
import { UpdateAuthorProfileDto } from '../dto/update-author-profile.dto.js';
import { escapeRegex } from '../../../common/utils/regex.utils.js';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(AuthorProfile.name)
    private readonly authorProfileModel: Model<AuthorProfileDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly rolesService: RolesService,
    private readonly authService: AuthService,
  ) {}

  async upgradeToAuthor(userId: string, dto: UpgradeAuthorDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const existingProfile = await this.authorProfileModel
      .findOne({ userId: user._id })
      .exec();

    if (existingProfile) {
      throw new ConflictException('Tài khoản này đã được đăng ký làm tác giả');
    }

    const trimmedPenName = dto.penName.trim();
    const existingPenName = await this.authorProfileModel
      .findOne({
        penName: { $regex: new RegExp(`^${escapeRegex(trimmedPenName)}$`, 'i') },
      })
      .exec();

    if (existingPenName) {
      throw new ConflictException('Bút danh này đã có người sử dụng. Vui lòng chọn bút danh khác');
    }

    const authorRole = await this.rolesService.findByName(RoleType.AUTHOR);
    if (!authorRole) {
      throw new BadRequestException('Vai trò tác giả không tồn tại trong hệ thống');
    }

    // 1. Cập nhật roleId và tăng tokenVersion để thu hồi phiên cũ
    user.roleId = authorRole._id;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    // 2. Tạo hồ sơ tác giả riêng biệt (không trùng lặp với bio của User)
    const authorProfile = await this.authorProfileModel.create({
      userId: user._id,
      penName: trimmedPenName,
      writingStyle: dto.writingStyle?.trim() || '',
      coverImage: dto.coverImage?.trim() || '',
      authorSince: dto.authorSince ? new Date(dto.authorSince) : new Date(),
      isActive: true,
    });

    // 3. Sinh token mới mang vai trò AUTHOR
    const tokens = await this.authService.generateTokens(
      user._id.toString(),
      RoleType.AUTHOR,
      user.tokenVersion,
    );

    return {
      success: true,
      message: 'Nâng cấp lên Tác giả thành công',
      data: {
        profile: authorProfile,
        tokens,
      },
    };
  }

  async getMyProfile(userId: string) {
    const profile = await this.authorProfileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'username email displayName avatar bio')
      .lean()
      .exec();

    if (!profile) {
      throw new NotFoundException('Không tìm thấy thông tin tác giả');
    }

    return {
      success: true,
      message: 'Lấy thông tin hồ sơ tác giả thành công',
      data: {
        profile,
      },
    };
  }

  async updateMyProfile(userId: string, dto: UpdateAuthorProfileDto) {
    const profile = await this.authorProfileModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!profile) {
      throw new NotFoundException('Không tìm thấy thông tin tác giả');
    }

    if (dto.penName !== undefined) {
      const trimmedPenName = dto.penName.trim();
      if (trimmedPenName.toLowerCase() !== profile.penName.toLowerCase()) {
        const existingPenName = await this.authorProfileModel
          .findOne({
            _id: { $ne: profile._id },
            penName: { $regex: new RegExp(`^${escapeRegex(trimmedPenName)}$`, 'i') },
          })
          .exec();

        if (existingPenName) {
          throw new ConflictException('Bút danh này đã có người sử dụng. Vui lòng chọn bút danh khác');
        }

        profile.penName = trimmedPenName;
      }
    }

    if (dto.writingStyle !== undefined) {
      profile.writingStyle = dto.writingStyle.trim();
    }

    if (dto.coverImage !== undefined) {
      profile.coverImage = dto.coverImage.trim();
    }

    if (dto.authorSince !== undefined) {
      profile.authorSince = new Date(dto.authorSince);
    }

    await profile.save();

    return {
      success: true,
      message: 'Cập nhật hồ sơ tác giả thành công',
      data: {
        profile,
      },
    };
  }

  async getPublicProfile(penName: string) {
    const trimmedPenName = penName.trim();
    const profile = await this.authorProfileModel
      .findOne({
        penName: { $regex: new RegExp(`^${escapeRegex(trimmedPenName)}$`, 'i') },
        isActive: true,
      })
      .populate('userId', 'displayName avatar bio')
      .lean()
      .exec();

    if (!profile) {
      throw new NotFoundException('Không tìm thấy tác giả này');
    }

    return {
      success: true,
      message: 'Lấy thông tin tác giả thành công',
      data: {
        profile,
      },
    };
  }
}
