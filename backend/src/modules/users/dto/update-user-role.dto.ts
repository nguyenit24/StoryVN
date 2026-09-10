import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleType } from '../../roles/schemas/role.schema.js';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: [RoleType.USER, RoleType.MANAGER, RoleType.ADMIN],
    example: RoleType.MANAGER,
    description: 'Vai trò mới của người dùng (Chỉ cho phép USER, MANAGER, ADMIN)',
  })
  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsEnum(RoleType, { message: 'Vai trò không hợp lệ' })
  role: RoleType;
}
