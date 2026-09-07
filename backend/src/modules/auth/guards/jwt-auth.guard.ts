import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TokenBlacklist,
  TokenBlacklistDocument,
} from '../schemas/token-blacklist.schema.js';
import { User, UserDocument } from '../../users/schemas/user.schema.js';

export interface JwtPayload {
  sub: string;
  jti: string;
  role: string;
  tokenVersion?: number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(TokenBlacklist.name)
    private readonly tokenBlacklistModel: Model<TokenBlacklistDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = '';

    const authHeader = request.headers['authorization'];
    if (authHeader && typeof authHeader === 'string') {
      token = authHeader.replace(/^Bearer\s+/i, '').trim();
    }

    if (!token && request.body?.accessToken && typeof request.body.accessToken === 'string') {
      token = request.body.accessToken.replace(/^Bearer\s+/i, '').trim();
    }

    if (!token && request.query) {
      const queryToken = request.query.token || request.query.accessToken;
      if (typeof queryToken === 'string') {
        token = queryToken.replace(/^Bearer\s+/i, '').trim();
      }
    }

    if (!token) {
      throw new UnauthorizedException('Vui lòng đăng nhập để tiếp tục');
    }

    let payload: JwtPayload;
    try {
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'default-access-secret-storyvn-2026';
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
      throw new UnauthorizedException('Token không hợp lệ');
    }

    if (!payload.jti) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const blacklisted = await this.tokenBlacklistModel.findOne({ jti: payload.jti }).exec();
    if (blacklisted) {
      throw new UnauthorizedException('Phiên đăng nhập đã bị thu hồi');
    }

    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đang bị khóa hoặc chưa được kích hoạt');
    }

    if (
      payload.tokenVersion !== undefined &&
      user.tokenVersion !== undefined &&
      payload.tokenVersion !== user.tokenVersion
    ) {
      throw new UnauthorizedException('Phiên đăng nhập đã bị vô hiệu hóa');
    }

    request.user = {
      sub: payload.sub,
      userId: payload.sub,
      jti: payload.jti,
      role: payload.role,
      tokenVersion: payload.tokenVersion,
      exp: payload.exp,
      iat: payload.iat,
    };

    return true;
  }
}
