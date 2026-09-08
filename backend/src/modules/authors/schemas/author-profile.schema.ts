import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';

export type AuthorProfileDocument = HydratedDocument<AuthorProfile>;

@Schema({ timestamps: true, collection: 'author_profiles' })
export class AuthorProfile {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  })
  penName: string;

  @Prop({
    type: String,
    trim: true,
    default: '',
  })
  writingStyle?: string;

  @Prop({
    type: String,
    trim: true,
    default: '',
  })
  coverImage?: string;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  authorSince?: Date;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const AuthorProfileSchema = SchemaFactory.createForClass(AuthorProfile);
