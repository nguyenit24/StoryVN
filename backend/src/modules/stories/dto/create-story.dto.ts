import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StoryStatus } from '../schemas/story.schema.js';

export class CreateStoryDto {
  @ApiProperty({
    example: 'Phàm Nhân Tu Tiên',
    description: 'Tên tác phẩm (từ 2 đến 200 ký tự). Slug sẽ tự động tạo từ tên tác phẩm.',
  })
  @IsNotEmpty({ message: 'Tên tác phẩm không được để trống' })
  @IsString({ message: 'Tên tác phẩm phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên tác phẩm phải có ít nhất 2 ký tự' })
  @MaxLength(200, { message: 'Tên tác phẩm không được vượt quá 200 ký tự' })
  title: string;

  @ApiPropertyOptional({
    example: 'Một thiếu niên bình thường xuất thân từ sơn thôn nghèo khó...',
    description: 'Tóm tắt / mô tả tác phẩm',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/cover.jpg',
    description: 'Đường dẫn ảnh bìa tác phẩm',
  })
  @IsOptional()
  @IsString({ message: 'Ảnh bìa phải là chuỗi ký tự' })
  coverUrl?: string;

  @ApiPropertyOptional({
    enum: StoryStatus,
    default: StoryStatus.DRAFT,
    description: 'Trạng thái tác phẩm (DRAFT, ONGOING, COMPLETED, PAUSED)',
  })
  @IsOptional()
  @IsEnum(StoryStatus, { message: 'Trạng thái tác phẩm không hợp lệ' })
  status?: StoryStatus;

  @ApiPropertyOptional({
    type: Boolean,
    default: false,
    description: 'Phân loại truyện hội viên (VIP) hoặc truyện thường (mặc định: false)',
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

  @ApiPropertyOptional({
    example: '65d3b1e3f1a2b3c4d5e6f7aa',
    description: 'ID tác giả (chỉ áp dụng cho Manager khi tạo thay; với Author sẽ tự động lấy từ tài khoản đăng nhập)',
  })
  @IsOptional()
  @IsMongoId({ message: 'authorId phải là một Mongo ObjectId hợp lệ' })
  authorId?: string;
}
