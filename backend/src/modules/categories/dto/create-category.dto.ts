import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Tiên Hiệp',
    description: 'Tên thể loại (từ 2 đến 100 ký tự)',
  })
  @IsNotEmpty({ message: 'Tên thể loại không được để trống' })
  @IsString({ message: 'Tên thể loại phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên thể loại phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Tên thể loại không được vượt quá 100 ký tự' })
  name: string;

  @ApiPropertyOptional({
    example: 'Thể loại truyện tu tiên, luyện khí cầu trường sinh',
    description: 'Mô tả chi tiết thể loại',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
  description?: string;
}
