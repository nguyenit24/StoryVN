import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Tiên Hiệp Tu Chân',
    description: 'Tên thể loại (từ 2 đến 100 ký tự). Slug sẽ tự động cập nhật theo tên mới.',
  })
  @IsOptional()
  @IsString({ message: 'Tên thể loại phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên thể loại phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Tên thể loại không được vượt quá 100 ký tự' })
  name?: string;

  @ApiPropertyOptional({
    example: 'Mô tả chi tiết thể loại sau khi cập nhật',
    description: 'Mô tả chi tiết thể loại',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
  description?: string;
}
