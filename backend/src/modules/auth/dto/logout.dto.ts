import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access Token (tùy chọn: có thể truyền tại đây hoặc qua Header Authorization)',
  })
  @IsOptional()
  @IsString({ message: 'Access token phải là chuỗi ký tự' })
  accessToken?: string;

  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh Token cần thu hồi (tùy chọn, nếu không gửi sẽ đăng xuất tất cả phiên)',
  })
  @IsOptional()
  @IsString({ message: 'Refresh token phải là chuỗi ký tự' })
  refreshToken?: string;
}
