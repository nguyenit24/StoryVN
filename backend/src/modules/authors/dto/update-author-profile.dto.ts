import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateAuthorProfileDto {
  @ApiPropertyOptional({
    example: 'Thiên Ngoại Phi Tiên',
    description: 'Bút danh mới của tác giả',
  })
  @IsOptional()
  @IsString({ message: 'Bút danh phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Bút danh phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Bút danh không được vượt quá 50 ký tự' })
  @Matches(/^[a-zA-Z0-9\s\u00C0-\u1EF9._-]+$/, {
    message: 'Bút danh chỉ được chứa chữ cái, số, dấu cách, dấu gạch nối hoặc gạch dưới',
  })
  penName?: string;

  @ApiPropertyOptional({
    example: 'Hài hước, sảng văn, miêu tả tâm lý sâu sắc, combat chân thực',
    description: 'Phong cách viết đặc trưng của tác giả',
  })
  @IsOptional()
  @IsString({ message: 'Phong cách viết phải là chuỗi ký tự' })
  @MaxLength(300, { message: 'Phong cách viết không được vượt quá 300 ký tự' })
  writingStyle?: string;

  @ApiPropertyOptional({
    example: '/uploads/covers/author-banner.jpg',
    description: 'Ảnh banner nền trang tác giả',
  })
  @IsOptional()
  @IsString({ message: 'Đường dẫn ảnh bìa phải là chuỗi ký tự' })
  coverImage?: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Thời gian bắt đầu sáng tác (định dạng YYYY-MM-DD để tính kinh nghiệm)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Thời gian bắt đầu sáng tác phải đúng định dạng ngày (YYYY-MM-DD)' })
  authorSince?: string;
}
