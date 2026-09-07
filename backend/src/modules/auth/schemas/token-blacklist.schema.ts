import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';

export type TokenBlacklistDocument = HydratedDocument<TokenBlacklist>;

@Schema({ timestamps: true })
export class TokenBlacklist {
  @Prop({ type: String, required: true, unique: true, index: true })
  jti: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: String, default: '' })
  reason?: string;
}

export const TokenBlacklistSchema = SchemaFactory.createForClass(TokenBlacklist);

TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
