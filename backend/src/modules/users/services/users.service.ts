import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { User, UserDocument } from '../schemas/user.schema.js';
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { ChangePasswordDto } from '../dto/change-password.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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

    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: {
        user,
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
}
