import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
import { Category } from '../../categories/schemas/category.schema.js';
import { Tag } from '../../tags/schemas/tag.schema.js';

export type StoryDocument = HydratedDocument<Story>;

export enum StoryStatus {
  DRAFT = 'DRAFT',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

@Schema({
  timestamps: true,
})
export class Story {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  authorId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop({
    type: String,
    default: null,
  })
  description?: string | null;

  @Prop({
    type: String,
    default: null,
  })
  coverUrl?: string | null;

  @Prop({
    type: String,
    enum: Object.values(StoryStatus),
    default: StoryStatus.DRAFT,
  })
  status: StoryStatus;

  @Prop({
    type: Boolean,
    default: false,
    index: true,
  })
  isVip: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Category.name }],
    default: [],
  })
  categoryIds: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: Tag.name }],
    default: [],
  })
  tagIds: Types.ObjectId[];
}

export const StorySchema = SchemaFactory.createForClass(Story);
