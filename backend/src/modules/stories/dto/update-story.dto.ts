import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StoryStatus } from '../schemas/story.schema.js';

export class UpdateStoryDto {
  @ApiPropertyOptional({
    example: 'Phàm Nhân Tu Tiên Chi Tiên Giới Thiên',
    description: 'Tên tác phẩm (từ 2 đến 200 ký tự). Slug sẽ tự động cập nhật theo tên mới.',
  })
  @IsOptional()
  @IsString({ message: 'Tên tác phẩm phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên tác phẩm phải có ít nhất 2 ký tự' })
  @MaxLength(200, { message: 'Tên tác phẩm không được vượt quá 200 ký tự' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Mô tả tác phẩm sau khi chỉnh sửa...',
    description: 'Tóm tắt / mô tả tác phẩm',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/cover-updated.jpg',
    description: 'Đường dẫn ảnh bìa tác phẩm',
  })
  @IsOptional()
  @IsString({ message: 'Ảnh bìa phải là chuỗi ký tự' })
  coverUrl?: string;

  @ApiPropertyOptional({
    enum: StoryStatus,
    description: 'Trạng thái tác phẩm (DRAFT, ONGOING, COMPLETED, PAUSED)',
  })
  @IsOptional()
  @IsEnum(StoryStatus, { message: 'Trạng thái tác phẩm không hợp lệ' })
  status?: StoryStatus;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Phân loại truyện hội viên (VIP) hoặc truyện thường',
  })
  @IsOptional()
  @IsBoolean({ message: 'isVip phải là giá trị boolean (true/false)' })
  isVip?: boolean;

  @ApiPropertyOptional({
    type: [String],
    example: ['65d3b1e3f1a2b3c4d5e6f7a8'],
    description: 'Danh sách ID thể loại tác phẩm thuộc về',
  })
  @IsOptional()
  @IsArray({ message: 'categoryIds phải là một mảng' })
  @IsMongoId({ each: true, message: 'Mỗi categoryId phải là một Mongo ObjectId hợp lệ' })
  categoryIds?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['65d3b1e3f1a2b3c4d5e6f7a9'],
    description: 'Danh sách ID thẻ (tag) gắn cho tác phẩm',
  })
  @IsOptional()
  @IsArray({ message: 'tagIds phải là một mảng' })
  @IsMongoId({ each: true, message: 'Mỗi tagId phải là một Mongo ObjectId hợp lệ' })
  tagIds?: string[];
}
