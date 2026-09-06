import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

import { User, UserDocument } from '../users/user.schema.js';
import { TokenBlacklist, TokenBlacklistDocument } from './token-blacklist.schema.js';
import { RolesService } from '../roles/roles.service.js';
import { RoleType } from '../roles/role.schema.js';
import { MailService } from '../../infrastructure/mail/mail.service.js';
import { RedisService } from '../../infrastructure/redis/redis.service.js';
import { parseDurationToMs } from '../../common/utils/time.utils.js';

import { RegisterDto } from './dto/register.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';

interface RefreshTokenPayload {
  sub: string;
  jti: string;
  tokenVersion: number;
  exp?: number;
  iat?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;
  private readonly accessExpiresInSeconds: number;
  private readonly refreshTtlMs: number;
  private readonly otpExpiresInSeconds: number;
  private readonly otpMaxAttempts: number;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(TokenBlacklist.name)
    private readonly tokenBlacklistModel: Model<TokenBlacklistDocument>,
    private readonly redisService: RedisService,
    private readonly rolesService: RolesService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'default-access-secret-storyvn-2026';
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret-storyvn-2026';
    this.accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';
    this.refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    this.accessExpiresInSeconds = Math.floor(parseDurationToMs(this.accessExpiresIn, 15 * 60 * 1000) / 1000);
    this.refreshTtlMs = parseDurationToMs(this.refreshExpiresIn, 7 * 24 * 60 * 60 * 1000);
    this.otpExpiresInSeconds = Number(this.configService.get<number>('OTP_EXPIRES_IN_SECONDS') ?? 300);
    this.otpMaxAttempts = Number(this.configService.get<number>('OTP_MAX_ATTEMPTS') ?? 5);
  }

  private get redis() {
    return this.redisService.getClient();
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const username = dto.username.toLowerCase().trim();
    const password = dto.password;

    // 1. Kiểm tra email trong MongoDB
    const existingEmailUser = await this.userModel.findOne({ email }).exec();
    if (existingEmailUser) {
      if (existingEmailUser.isEmailVerified) {
        throw new ConflictException('Email đã tồn tại trong hệ thống');
      }
      // Dọn dẹp bản ghi cũ chưa xác thực (nếu có từ trước)
      await this.userModel.deleteOne({ _id: existingEmailUser._id }).exec();
    }

    // 2. Kiểm tra username trong MongoDB
    const existingUsernameUser = await this.userModel.findOne({ username }).exec();
    if (existingUsernameUser) {
      if (existingUsernameUser.isEmailVerified) {
        throw new ConflictException('Tên người dùng đã tồn tại trong hệ thống');
      }
      await this.userModel.deleteOne({ _id: existingUsernameUser._id }).exec();
    }

    // 3. Kiểm tra Role USER
    const userRole = await this.rolesService.findByName(RoleType.USER);
    if (!userRole) {
      throw new BadRequestException('Vai trò người dùng không tồn tại');
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Tạo OTP và lưu tạm dữ liệu đăng ký vào Redis (chưa tạo trong MongoDB)
    await this.redis.del(`otp:${email}`);

    const otp = crypto.randomInt(100000, 1000000).toString();
    const pendingRegistration = {
      otp,
      attempts: 0,
      userData: {
        username,
        email,
        password: hashedPassword,
        displayName: dto.displayName?.trim() || username,
        roleId: userRole._id.toString(),
      },
    };

    await this.redis.set(
      `otp:${email}`,
      JSON.stringify(pendingRegistration),
      'EX',
      this.otpExpiresInSeconds,
    );

    // 6. Gửi email xác thực OTP
    await this.sendOtpEmail(email, otp);

    return {
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      data: null,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const email = dto.email.toLowerCase().trim();
    const inputOtp = dto.otp.trim();

    const rawOtpData = await this.redis.get(`otp:${email}`);
    if (!rawOtpData) {
      throw new BadRequestException('Mã OTP không tồn tại hoặc đã hết hạn. Vui lòng đăng ký lại.');
    }

    const otpData = JSON.parse(rawOtpData);

    if (otpData.attempts >= this.otpMaxAttempts) {
      await this.redis.del(`otp:${email}`);
      throw new HttpException(
        `Bạn đã nhập sai OTP quá ${this.otpMaxAttempts} lần. Vui lòng đăng ký lại để nhận mã mới.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (otpData.otp !== inputOtp) {
      otpData.attempts += 1;
      const ttl = await this.redis.ttl(`otp:${email}`);
      const remainingAttempts = Math.max(0, this.otpMaxAttempts - otpData.attempts);

      if (remainingAttempts <= 0 || ttl <= 0) {
        await this.redis.del(`otp:${email}`);
        throw new HttpException(
          `Bạn đã nhập sai OTP quá ${this.otpMaxAttempts} lần. Vui lòng đăng ký lại để nhận mã mới.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      await this.redis.set(
        `otp:${email}`,
        JSON.stringify(otpData),
        'EX',
        Math.max(ttl, 1),
      );

      const minutes = Math.floor(ttl / 60);
      const seconds = ttl % 60;
      const timeStr = minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;

      throw new BadRequestException(
        `Mã OTP không chính xác. Bạn còn ${remainingAttempts} lần thử (mã hết hạn sau ${timeStr}).`,
      );
    }

    // OTP chính xác: Lưu User vào MongoDB từ dữ liệu tạm trong Redis
    if (otpData.userData) {
      const conflictingUser = await this.userModel.findOne({
        $or: [{ email }, { username: otpData.userData.username }],
      }).exec();

      if (conflictingUser) {
        await this.redis.del(`otp:${email}`);
        throw new ConflictException('Email hoặc tên người dùng đã tồn tại trong hệ thống');
      }

      await this.userModel.create({
        username: otpData.userData.username,
        email: otpData.userData.email,
        password: otpData.userData.password,
        displayName: otpData.userData.displayName,
        roleId: new Types.ObjectId(otpData.userData.roleId),
        isActive: true,
        isEmailVerified: true,
        tokenVersion: 0,
      });
    } else {
      // Tương thích ngược nếu bản ghi user đã có sẵn trong MongoDB
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('Tài khoản không tồn tại hoặc phiên xác thực đã hết hạn');
      }
      user.isEmailVerified = true;
      user.isActive = true;
      await user.save();
    }

    await this.redis.del(`otp:${email}`);

    return {
      success: true,
      message: 'Xác thực tài khoản thành công. Bạn có thể đăng nhập ngay bây giờ.',
      data: null,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const password = dto.password;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Tài khoản chưa được xác thực email. Vui lòng kiểm tra email.');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đang bị khóa hoặc chưa được kích hoạt');
    }

    const role = await this.rolesService.findById(user.roleId);
    const roleName = role ? role.name : RoleType.USER;

    const accessJti = crypto.randomUUID();
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user._id.toString(),
        jti: accessJti,
        role: roleName,
        tokenVersion: user.tokenVersion ?? 0,
      },
      {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn as any,
      },
    );

    const refreshJti = crypto.randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user._id.toString(),
        jti: refreshJti,
        tokenVersion: user.tokenVersion ?? 0,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as any,
      },
    );

    user.lastLoginAt = new Date();
    await user.save();

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: roleName,
        },
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const rawToken = dto.refreshToken.trim();

    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(rawToken, {
        secret: this.refreshSecret,
      });
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (!payload.jti || !payload.sub) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // Kiểm tra TokenBlacklist: nếu refresh token jti đã bị blacklist -> REUSE DETECTED!
    const isBlacklisted = await this.tokenBlacklistModel.findOne({ jti: payload.jti }).exec();
    if (isBlacklisted) {
      await this.userModel.updateOne(
        { _id: payload.sub },
        { $inc: { tokenVersion: 1 } },
      ).exec();
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã bị thu hồi');
    }

    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đang bị khóa hoặc chưa được kích hoạt');
    }

    if (user.tokenVersion !== undefined && payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Phiên đăng nhập đã bị thu hồi');
    }

    // Refresh Token Rotation: Blacklist token cũ vào TokenBlacklist
    const expiresAt = payload.exp
      ? new Date(payload.exp * 1000)
      : new Date(Date.now() + this.refreshTtlMs);

    await this.tokenBlacklistModel.updateOne(
      { jti: payload.jti },
      {
        $setOnInsert: {
          jti: payload.jti,
          userId: user._id,
          expiresAt,
          reason: 'rotated',
        },
      },
      { upsert: true },
    ).exec();

    const role = await this.rolesService.findById(user.roleId);
    const roleName = role ? role.name : RoleType.USER;

    const newAccessJti = crypto.randomUUID();
    const newAccessToken = await this.jwtService.signAsync(
      {
        sub: user._id.toString(),
        jti: newAccessJti,
        role: roleName,
        tokenVersion: user.tokenVersion ?? 0,
      },
      {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn as any,
      },
    );

    const newRefreshJti = crypto.randomUUID();
    const newRefreshToken = await this.jwtService.signAsync(
      {
        sub: user._id.toString(),
        jti: newRefreshJti,
        tokenVersion: user.tokenVersion ?? 0,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as any,
      },
    );

    return {
      success: true,
      message: 'Làm mới token thành công',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async logout(userId: string, accessJti: string, accessExp?: number, rawRefreshToken?: string) {
    if (!accessJti) {
      throw new BadRequestException('Token không hợp lệ');
    }

    const accessExpiresAt = accessExp
      ? new Date(accessExp * 1000)
      : new Date(Date.now() + this.accessExpiresInSeconds * 1000);

    // Blacklist access token bằng jti và TTL
    await this.tokenBlacklistModel.updateOne(
      { jti: accessJti },
      {
        $setOnInsert: {
          jti: accessJti,
          userId: new Types.ObjectId(userId),
          expiresAt: accessExpiresAt,
          reason: 'logout',
        },
      },
      { upsert: true },
    ).exec();

    // Nếu có refresh token được truyền lên, blacklist jti của refresh token đó
    if (rawRefreshToken?.trim()) {
      try {
        const refreshPayload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
          rawRefreshToken.trim(),
          { secret: this.refreshSecret },
        );

        if (refreshPayload?.jti) {
          const refreshExpiresAt = refreshPayload.exp
            ? new Date(refreshPayload.exp * 1000)
            : new Date(Date.now() + this.refreshTtlMs);

          await this.tokenBlacklistModel.updateOne(
            { jti: refreshPayload.jti },
            {
              $setOnInsert: {
                jti: refreshPayload.jti,
                userId: new Types.ObjectId(userId),
                expiresAt: refreshExpiresAt,
                reason: 'logout',
              },
            },
            { upsert: true },
          ).exec();
        }
      } catch {
        // Refresh token đã hết hạn hoặc không hợp lệ thì bỏ qua
      }
    } else {
      // Nếu không chỉ định refresh token cụ thể, tăng tokenVersion để đăng xuất tất cả phiên
      await this.userModel.updateOne(
        { _id: userId },
        { $inc: { tokenVersion: 1 } },
      ).exec();
    }

    return {
      success: true,
      message: 'Đăng xuất thành công',
      data: null,
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

  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const minutes = Math.floor(this.otpExpiresInSeconds / 60);
    this.logger.log(`[AUTH] Mã OTP cho ${email}: ${otp} (hiệu lực ${minutes} phút)`);

    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Mã xác thực đăng ký StoryVN',
        text: `Mã OTP xác thực tài khoản của bạn là: ${otp}. Mã này có hiệu lực trong ${minutes} phút.`,
      });
    } catch (error: any) {
      this.logger.error(`Gửi email OTP thất bại tới ${email}: ${error?.message || error}`);
      throw new InternalServerErrorException(
        'Không thể gửi email xác thực. Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau.',
      );
    }
  }
}
