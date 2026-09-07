import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './controllers/auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

import {
  TokenBlacklist,
  TokenBlacklistSchema,
} from './schemas/token-blacklist.schema.js';
import { User, UserSchema } from '../users/schemas/user.schema.js';
import { RolesModule } from '../roles/roles.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TokenBlacklist.name, schema: TokenBlacklistSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_ACCESS_SECRET') ||
          'default-access-secret-storyvn-2026',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m') as any,
        },
      }),
    }),
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, MongooseModule, JwtModule],
})
export class AuthModule {}
