import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Trạng thái hoạt động của tài khoản (true: kích hoạt, false: khóa tài khoản)',
  })
  @IsNotEmpty({ message: 'Trạng thái isActive không được để trống' })
  @IsBoolean({ message: 'isActive phải là giá trị boolean' })
  isActive: boolean;
}
