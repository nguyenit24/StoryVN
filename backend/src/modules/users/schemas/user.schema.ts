import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../roles/schemas/role.schema.js';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class SocialLinks {
  @Prop({ type: String, trim: true, default: '' })
  facebook?: string;

  @Prop({ type: String, trim: true, default: '' })
  twitter?: string;
}

export const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, trim: true, default: '' })
  displayName?: string;

  @Prop({ type: String, default: '' })
  avatar?: string;

  @Prop({ type: String, default: '' })
  bio?: string;

  @Prop({ type: SocialLinksSchema, default: () => ({}) })
  socialLinks?: SocialLinks;

  @Prop({ type: Types.ObjectId, ref: Role.name, required: true, index: true })
  roleId: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  tokenVersion: number;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
