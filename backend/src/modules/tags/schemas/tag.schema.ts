import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({
  timestamps: true,
})
export class Tag {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

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
}

export const TagSchema = SchemaFactory.createForClass(Tag);
