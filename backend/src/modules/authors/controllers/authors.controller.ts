import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthorsService } from '../services/authors.service.js';
import { UpgradeAuthorDto } from '../dto/upgrade-author.dto.js';
import { UpdateAuthorProfileDto } from '../dto/update-author-profile.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { RoleType } from '../../roles/schemas/role.schema.js';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post('upgrade')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Nâng cấp tài khoản hiện tại lên Tác giả' })
  async upgradeToAuthor(@Req() req: any, @Body() dto: UpgradeAuthorDto) {
    return this.authorsService.upgradeToAuthor(req.user.sub, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ tác giả của chính mình' })
  async getMyProfile(@Req() req: any) {
    return this.authorsService.getMyProfile(req.user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ tác giả của chính mình' })
  async updateMyProfile(@Req() req: any, @Body() dto: UpdateAuthorProfileDto) {
    return this.authorsService.updateMyProfile(req.user.sub, dto);
  }

  @Get(':penName')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xem thông tin hồ sơ công khai của tác giả theo bút danh' })
  async getPublicProfile(@Param('penName') penName: string) {
    return this.authorsService.getPublicProfile(penName);
  }
}
