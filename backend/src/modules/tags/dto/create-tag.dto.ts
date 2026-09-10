import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'Hệ Thống',
    description: 'Tên thẻ tag (từ 2 đến 50 ký tự)',
  })
  @IsNotEmpty({ message: 'Tên thẻ không được để trống' })
  @IsString({ message: 'Tên thẻ phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên thẻ phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên thẻ không được vượt quá 50 ký tự' })
  name: string;

  @ApiPropertyOptional({
    example: 'Các tác phẩm có yếu tố hệ thống hỗ trợ nhân vật chính',
    description: 'Mô tả chi tiết thẻ',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
  description?: string;
}
