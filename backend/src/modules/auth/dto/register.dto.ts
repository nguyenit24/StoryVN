import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'nguyenvana',
    description: 'Tên đăng nhập (3-30 ký tự, chỉ chứa chữ cái, chữ số và dấu gạch dưới)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MinLength(3, { message: 'Tên đăng nhập phải có tối thiểu 3 ký tự' })
  @MaxLength(30, { message: 'Tên đăng nhập tối đa 30 ký tự' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Tên đăng nhập chỉ được chứa chữ cái, chữ số và dấu gạch dưới',
  })
  username: string;

  @ApiProperty({
    example: 'nguyenvana@gmail.com',
    description: 'Địa chỉ email người dùng',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' })
  password: string;

  @ApiPropertyOptional({
    example: 'Nguyễn Văn A',
    description: 'Tên hiển thị (tùy chọn)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Tên hiển thị tối đa 50 ký tự' })
  displayName?: string;
}
