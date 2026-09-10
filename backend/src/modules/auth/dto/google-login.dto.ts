import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google ID Token (credential) nhận từ Google Identity Services trên Frontend',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...',
  })
  @IsNotEmpty({ message: 'Google credential không được để trống' })
  @IsString({ message: 'Google credential phải là chuỗi hợp lệ' })
  credential: string;
}
