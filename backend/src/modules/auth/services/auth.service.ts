import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
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

import { User, UserDocument } from '../../users/schemas/user.schema.js';
import { TokenBlacklist, TokenBlacklistDocument } from '../schemas/token-blacklist.schema.js';
import { RolesService } from '../../roles/services/roles.service.js';
import { RoleType } from '../../roles/schemas/role.schema.js';
import { MailService } from '../../../infrastructure/mail/mail.service.js';
import { RedisService } from '../../../infrastructure/redis/redis.service.js';
import { parseDurationToMs } from '../../../common/utils/time.utils.js';
import { OAuth2Client } from 'google-auth-library';

import { RegisterDto } from '../dto/register.dto.js';
import { VerifyOtpDto } from '../dto/verify-otp.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { RefreshTokenDto } from '../dto/refresh-token.dto.js';
import { ForgotPasswordDto } from '../dto/forgot-password.dto.js';
import { ResetPasswordDto } from '../dto/reset-password.dto.js';
import { GoogleLoginDto } from '../dto/google-login.dto.js';

interface RefreshTokenPayload {
  sub: string;
  jti: string;
  tokenVersion: number;
  exp?: number;
  iat?: number;
}

interface PendingRegistrationData {
  otp: string;
  attempts: number;
  userData?: {
    username: string;
    email: string;
    password: string;
    displayName: string;
    roleId: string;
  };
}

interface ForgotPasswordOtpData {
  otp: string;
  attempts: number;
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
  private readonly googleClientId: string;
  private readonly googleClient: OAuth2Client;

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
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async generateTokens(
    userId: string,
    role: string,
    tokenVersion = 0,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessJti = crypto.randomUUID();
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        jti: accessJti,
        role,
        tokenVersion,
      },
      {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn as any,
      },
    );

    const refreshJti = crypto.randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        jti: refreshJti,
        tokenVersion,
      },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as any,
      },
    );

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const username = dto.username.toLowerCase().trim();
    const password = dto.password;

    const existingEmailUser = await this.userModel.findOne({ email }).exec();
    if (existingEmailUser) {
      throw new ConflictException('Email đã tồn tại trong hệ thống');
    }

    const existingUsernameUser = await this.userModel.findOne({ username }).exec();
    if (existingUsernameUser) {
      throw new ConflictException('Tên người dùng đã tồn tại trong hệ thống');
    }

    const userRole = await this.rolesService.findByName(RoleType.USER);
    if (!userRole) {
      throw new BadRequestException('Vai trò người dùng không tồn tại');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.redisService.del(`otp:${email}`);

    const otp = crypto.randomInt(100000, 1000000).toString();
    const pendingRegistration: PendingRegistrationData = {
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

    await this.redisService.setJson(
      `otp:${email}`,
      pendingRegistration,
      this.otpExpiresInSeconds,
    );

    const expiresInMinutes = Math.floor(this.otpExpiresInSeconds / 60);
    await this.mailService.sendOtpEmail(email, otp, expiresInMinutes);

    return {
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      data: null,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const email = dto.email.toLowerCase().trim();
    const inputOtp = dto.otp.trim();

    const otpData = await this.redisService.getJson<PendingRegistrationData>(`otp:${email}`);
    if (!otpData) {
      throw new BadRequestException('Mã OTP không tồn tại hoặc đã hết hạn. Vui lòng đăng ký lại.');
    }

    if (otpData.attempts >= this.otpMaxAttempts) {
      await this.redisService.del(`otp:${email}`);
      throw new HttpException(
        `Bạn đã nhập sai OTP quá ${this.otpMaxAttempts} lần. Vui lòng đăng ký lại để nhận mã mới.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (otpData.otp !== inputOtp) {
      otpData.attempts += 1;
      const ttl = await this.redisService.ttl(`otp:${email}`);
      const remainingAttempts = Math.max(0, this.otpMaxAttempts - otpData.attempts);

      if (remainingAttempts <= 0 || ttl <= 0) {
        await this.redisService.del(`otp:${email}`);
        throw new HttpException(
          `Bạn đã nhập sai OTP quá ${this.otpMaxAttempts} lần. Vui lòng đăng ký lại để nhận mã mới.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      await this.redisService.setJson(`otp:${email}`, otpData, Math.max(ttl, 1));

      const minutes = Math.floor(ttl / 60);
      const seconds = ttl % 60;
      const timeStr = minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;

      throw new BadRequestException(
        `Mã OTP không chính xác. Bạn còn ${remainingAttempts} lần thử (mã hết hạn sau ${timeStr}).`,
      );
    }

    if (otpData.userData) {
      const conflictingUser = await this.userModel.findOne({
        $or: [{ email }, { username: otpData.userData.username }],
      }).exec();

      if (conflictingUser) {
        await this.redisService.del(`otp:${email}`);
        throw new ConflictException('Email hoặc tên người dùng đã tồn tại trong hệ thống');
      }

      await this.userModel.create({
        username: otpData.userData.username,
        email: otpData.userData.email,
        password: otpData.userData.password,
        displayName: otpData.userData.displayName,
        roleId: new Types.ObjectId(otpData.userData.roleId),
        isActive: true,
        tokenVersion: 0,
      });
    } else {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException('Tài khoản không tồn tại hoặc phiên xác thực đã hết hạn');
      }
      user.isActive = true;
      await user.save();
    }

    await this.redisService.del(`otp:${email}`);

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

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đang bị khóa hoặc chưa được kích hoạt');
    }

    const role = await this.rolesService.findById(user.roleId);
    const roleName = role ? role.name : RoleType.USER;

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id.toString(),
      roleName,
      user.tokenVersion ?? 0,
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

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      user._id.toString(),
      roleName,
      user.tokenVersion ?? 0,
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
        // Refresh token không hợp lệ hoặc đã hết hạn thì bỏ qua
      }
    } else {
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

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với email này');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đang bị khóa hoặc chưa được kích hoạt');
    }

    await this.redisService.del(`otp:forgot-password:${email}`);

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpData: ForgotPasswordOtpData = {
      otp,
      attempts: 0,
    };

    await this.redisService.setJson(
      `otp:forgot-password:${email}`,
      otpData,
      this.otpExpiresInSeconds,
    );

    const expiresInMinutes = Math.floor(this.otpExpiresInSeconds / 60);
    await this.mailService.sendForgotPasswordOtpEmail(email, otp, expiresInMinutes);

    return {
      success: true,
      message: 'Mã OTP đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
      data: null,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const inputOtp = dto.otp.trim();

    const otpData = await this.redisService.getJson<ForgotPasswordOtpData>(`otp:forgot-password:${email}`);
    if (!otpData) {
      throw new BadRequestException('Mã OTP không tồn tại hoặc đã hết hạn. Vui lòng gửi lại yêu cầu quên mật khẩu.');
    }

    if (otpData.attempts >= this.otpMaxAttempts) {
      await this.redisService.del(`otp:forgot-password:${email}`);
      throw new HttpException(
        `Bạn đã nhập sai OTP quá ${this.otpMaxAttempts} lần. Vui lòng gửi lại yêu cầu mới.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (otpData.otp !== inputOtp) {
      otpData.attempts += 1;
      const ttl = await this.redisService.ttl(`otp:forgot-password:${email}`);
      const remainingAttempts = Math.max(0, this.otpMaxAttempts - otpData.attempts);

      if (remainingAttempts <= 0 || ttl <= 0) {
        await this.redisService.del(`otp:forgot-password:${email}`);
        throw new HttpException(
          `Bạn đã nhập sai OTP quá ${this.otpMaxAttempts} lần. Vui lòng gửi lại yêu cầu mới.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      await this.redisService.setJson(`otp:forgot-password:${email}`, otpData, Math.max(ttl, 1));

      const minutes = Math.floor(ttl / 60);
      const seconds = ttl % 60;
      const timeStr = minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;

      throw new BadRequestException(
        `Mã OTP không chính xác. Bạn còn ${remainingAttempts} lần thử (mã hết hạn sau ${timeStr}).`,
      );
    }

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      await this.redisService.del(`otp:forgot-password:${email}`);
      throw new NotFoundException('Tài khoản không tồn tại trong hệ thống');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    await this.redisService.del(`otp:forgot-password:${email}`);

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.',
      data: null,
    };
  }

  async loginWithGoogle(dto: GoogleLoginDto) {
    if (!this.googleClientId) {
      throw new BadRequestException('Chưa cấu hình GOOGLE_CLIENT_ID trên hệ thống');
    }

    let payload: any;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.credential.trim(),
        audience: this.googleClientId,
      });
      payload = ticket.getPayload();
    } catch (error: any) {
      this.logger.error(`Lỗi xác thực Google ID Token: ${error?.message}`);
      throw new UnauthorizedException('Google ID Token không hợp lệ hoặc đã hết hạn');
    }

    if (!payload?.email) {
      throw new UnauthorizedException('Tài khoản Google không cung cấp email');
    }

    const isEmailVerified = payload.email_verified === true || payload.email_verified === 'true';
    if (!isEmailVerified) {
      throw new UnauthorizedException('Email Google chưa được xác thực');
    }

    const email = payload.email.toLowerCase().trim();

    let user = await this.userModel.findOne({ email }).exec();

    if (user) {
      if (!user.isActive) {
        throw new ForbiddenException('Tài khoản đang bị khóa hoặc chưa được kích hoạt');
      }

      if (!user.avatar && payload.picture) {
        user.avatar = payload.picture;
      }
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      const rawBase = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user';
      const baseUsername = rawBase.length < 3 ? `${rawBase}user` : rawBase.slice(0, 20);

      let candidateUsername = baseUsername;
      let existingUsername = await this.userModel.exists({ username: candidateUsername });
      while (existingUsername) {
        candidateUsername = `${baseUsername.slice(0, 15)}_${crypto.randomInt(1000, 9999)}`;
        existingUsername = await this.userModel.exists({ username: candidateUsername });
      }

      const userRole = await this.rolesService.findByName(RoleType.USER);
      if (!userRole) {
        throw new BadRequestException('Vai trò người dùng mặc định không tồn tại trong hệ thống');
      }

      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await this.userModel.create({
        username: candidateUsername,
        email,
        password: hashedPassword,
        displayName: payload.name?.trim() || candidateUsername,
        avatar: payload.picture || '',
        roleId: userRole._id,
        isActive: true,
        tokenVersion: 0,
        lastLoginAt: new Date(),
      });
    }

    const role = await this.rolesService.findById(user.roleId);
    const roleName = role ? role.name : RoleType.USER;

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id.toString(),
      roleName,
      user.tokenVersion ?? 0,
    );

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
}
