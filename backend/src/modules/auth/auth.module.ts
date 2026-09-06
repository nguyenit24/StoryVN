import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import {
  TokenBlacklist,
  TokenBlacklistSchema,
} from './token-blacklist.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TokenBlacklist.name,
        schema: TokenBlacklistSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [MongooseModule],
})
export class AuthModule { }
