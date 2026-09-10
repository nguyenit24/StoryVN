import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../services/users.service.js';
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { ChangePasswordDto } from '../dto/change-password.dto.js';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto.js';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto.js';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { RoleType } from '../../roles/schemas/role.schema.js';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('stats/overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy dữ liệu thống kê tổng quan người dùng (Admin)' })
  async getOverviewStats() {
    return this.usersService.getOverviewStats();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách người dùng (Chỉ Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.usersService.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ người dùng hiện tại' })
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa hồ sơ cá nhân' })
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.sub, dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản trong hồ sơ cá nhân' })
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.sub, dto);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật vai trò người dùng (Chỉ Admin)',
    description:
      'Chỉ cho phép chuyển đổi giữa USER, MANAGER, ADMIN. Tuyệt đối không cho phép gán AUTHOR vì người dùng tự nâng cấp lên tác giả qua quy trình riêng.',
  })
  async updateRole(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(req.user.sub, id, dto.role);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Khóa hoặc mở khóa tài khoản người dùng (Chỉ Admin)',
    description: 'Cập nhật trạng thái isActive của tài khoản và thu hồi token nếu bị khóa',
  })
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(req.user.sub, id, dto.isActive);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa tài khoản người dùng bởi Quản trị viên (Chỉ Admin)' })
  async adminUpdateUser(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.usersService.adminUpdateUser(req.user.sub, id, dto);
  }

  @Get(':identifier')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xem hồ sơ công khai theo ID, Username hoặc Bút danh' })
  async findByIdentifier(@Param('identifier') identifier: string) {
    return this.usersService.findByIdentifier(identifier);
  }
}

