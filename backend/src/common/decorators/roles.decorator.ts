import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../modules/roles/schemas/role.schema.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (RoleType | string)[]) => SetMetadata(ROLES_KEY, roles);
export const Role = Roles;
