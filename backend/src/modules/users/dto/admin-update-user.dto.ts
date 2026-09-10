import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleType } from '../../roles/schemas/role.schema.js';

export class AdminUpdateUserDto {
  @ApiPropertyOptional({
    enum: [RoleType.USER, RoleType.MANAGER, RoleType.ADMIN],
    description: 'Vai trò mới của người dùng (Chỉ cho phép: USER, MANAGER, ADMIN)',
  })
  @IsOptional()
  @IsEnum(RoleType, { message: 'Vai trò không hợp lệ' })
  role?: RoleType;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Trạng thái hoạt động tài khoản (true: kích hoạt, false: khóa)',
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Tên hiển thị' })
  @IsOptional()
  @IsString({ message: 'displayName phải là chuỗi' })
  displayName?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử' })
  @IsOptional()
  @IsString({ message: 'bio phải là chuỗi' })
  bio?: string;
}
