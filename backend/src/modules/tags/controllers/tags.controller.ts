import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagsService } from '../services/tags.service.js';
import { CreateTagDto } from '../dto/create-tag.dto.js';
import { UpdateTagDto } from '../dto/update-tag.dto.js';
import { QueryTagsDto } from '../dto/query-tags.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { RoleType } from '../../roles/schemas/role.schema.js';

@ApiTags('Tags')
@Controller('tags')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách thẻ (Admin, Manager, Author)',
    description: 'Hỗ trợ tìm kiếm và phân trang ở Backend',
  })
  async findAll(@Query() query: QueryTagsDto) {
    return this.tagsService.findAll(query);
  }

  @Post('seed')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Khởi tạo danh sách thẻ tag mẫu chuẩn tiếng Việt (Admin, Manager)',
    description: 'Tự động tạo các thẻ tag mẫu thực tế sát các web truyện lớn',
  })
  async seed() {
    return this.tagsService.seedTags();
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo thẻ tag mới (Admin, Manager)',
  })
  async create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chỉnh sửa thẻ tag (Admin, Manager)',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa thẻ tag (Admin, Manager)',
    description: 'Kiểm tra và ngăn chặn nếu thẻ đang được sử dụng trong tác phẩm',
  })
  async delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }
}
