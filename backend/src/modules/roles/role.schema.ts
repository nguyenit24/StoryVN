import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

export enum RoleType {
  USER = 'USER',
  AUTHOR = 'AUTHOR',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class Role {
  @Prop({
    type: String,
    required: true,
    unique: true,
    enum: RoleType,
  })
  name: RoleType;

  @Prop({ type: String, default: '' })
  description?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
