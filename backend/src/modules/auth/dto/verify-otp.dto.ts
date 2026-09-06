import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'nguyenvana@gmail.com',
    description: 'Địa chỉ email đã đăng ký',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Mã xác thực OTP gồm đúng 6 chữ số',
  })
  @IsString()
  @IsNotEmpty({ message: 'Mã OTP không được để trống' })
  @Length(6, 6, { message: 'Mã OTP phải có đúng 6 chữ số' })
  @Matches(/^\d{6}$/, { message: 'Mã OTP phải là chuỗi 6 chữ số' })
  otp: string;
}
