import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTagDto {
  @ApiPropertyOptional({
    example: 'Vô Địch Lưu',
    description: 'Tên thẻ tag (từ 2 đến 50 ký tự). Slug sẽ tự động cập nhật theo tên mới.',
  })
  @IsOptional()
  @IsString({ message: 'Tên thẻ phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên thẻ phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên thẻ không được vượt quá 50 ký tự' })
  name?: string;

  @ApiPropertyOptional({
    example: 'Mô tả chi tiết thẻ sau khi cập nhật',
    description: 'Mô tả chi tiết thẻ',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
  description?: string;
}
