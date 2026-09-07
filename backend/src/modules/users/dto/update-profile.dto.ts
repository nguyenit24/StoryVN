import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

export class SocialLinksDto {
  @ApiPropertyOptional({ example: 'https://facebook.com/username' })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://x.com/username' })
  @IsOptional()
  @IsString()
  twitter?: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn A', description: 'Tên hiển thị' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Tên hiển thị không được vượt quá 50 ký tự' })
  displayName?: string;

  @ApiPropertyOptional({ example: '/uploads/avatars/user-avatar.png', description: 'Đường dẫn ảnh đại diện' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: 'Xin chào, tôi là độc giả trung thành của StoryVN.', description: 'Tiểu sử cá nhân' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'Tiểu sử không được vượt quá 300 ký tự' })
  bio?: string;

  @ApiPropertyOptional({ type: SocialLinksDto, description: 'Liên kết mạng xã hội (facebook, twitter)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}
