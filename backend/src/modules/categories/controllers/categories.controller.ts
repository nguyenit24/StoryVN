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
import { CategoriesService } from '../services/categories.service.js';
import { CreateCategoryDto } from '../dto/create-category.dto.js';
import { UpdateCategoryDto } from '../dto/update-category.dto.js';
import { QueryCategoriesDto } from '../dto/query-categories.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { RoleType } from '../../roles/schemas/role.schema.js';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách thể loại (Admin, Manager, Author)',
    description: 'Hỗ trợ tìm kiếm và phân trang ở Backend',
  })
  async findAll(@Query() query: QueryCategoriesDto) {
    return this.categoriesService.findAll(query);
  }

  @Post('seed')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Khởi tạo danh sách thể loại mẫu chuẩn tiếng Việt (Admin, Manager)',
    description: 'Tự động tạo các thể loại mẫu thực tế sát các web truyện lớn',
  })
  async seed() {
    return this.categoriesService.seedCategories();
  }

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo thể loại mới (Admin, Manager)',
  })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chỉnh sửa thể loại (Admin, Manager)',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa thể loại (Admin, Manager)',
    description: 'Kiểm tra và ngăn chặn nếu thể loại đang được sử dụng trong tác phẩm',
  })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
