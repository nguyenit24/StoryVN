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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoriesService } from '../services/stories.service.js';
import { CreateStoryDto } from '../dto/create-story.dto.js';
import { UpdateStoryDto } from '../dto/update-story.dto.js';
import { QueryMyStoriesDto } from '../dto/query-my-stories.dto.js';
import { QueryAdminStoriesDto } from '../dto/query-admin-stories.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { RoleType } from '../../roles/schemas/role.schema.js';

@ApiTags('Stories')
@Controller('stories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả tác phẩm (Admin, Manager)',
    description: 'Danh sách tác phẩm phục vụ quản lý, kiểm duyệt, lọc và phân trang',
  })
  async findAll(@Query() query: QueryAdminStoriesDto) {
    return this.storiesService.findAllForAdmin(query);
  }

  @Post()
  @Roles(RoleType.MANAGER, RoleType.AUTHOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo tác phẩm mới (Manager, Author)',
    description:
      'Manager có thể tạo tác phẩm hoặc chỉ định authorId. Author chỉ tạo tác phẩm của chính mình. Slug tự động sinh từ tiêu đề.',
  })
  async create(@Req() req: any, @Body() dto: CreateStoryDto) {
    return this.storiesService.create(req.user, dto);
  }

  @Get('my')
  @Roles(RoleType.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách tác phẩm của chính mình (Chỉ Author)',
    description: 'Xem danh sách tác phẩm do Author hiện tại tạo, có phân trang và lọc',
  })
  async findMyStories(@Req() req: any, @Query() query: QueryMyStoriesDto) {
    return this.storiesService.findMyStories(req.user.userId, query);
  }

  @Get('my/:slug')
  @Roles(RoleType.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết tác phẩm của chính mình theo slug (Chỉ Author)',
    description: 'Xem chi tiết một tác phẩm do Author hiện tại sở hữu qua slug an toàn và thân thiện SEO',
  })
  async findMyStoryBySlug(@Req() req: any, @Param('slug') slug: string) {
    return this.storiesService.findMyStoryBySlug(req.user.userId, slug);
  }

  @Patch(':id')
  @Roles(RoleType.MANAGER, RoleType.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chỉnh sửa tác phẩm (Manager, Author sở hữu)',
    description:
      'Manager chỉnh sửa mọi Story. Author chỉ chỉnh sửa Story do chính mình tạo. Slug tự động cập nhật nếu đổi tiêu đề.',
  })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateStoryDto,
  ) {
    return this.storiesService.update(req.user, id, dto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.AUTHOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa tác phẩm (Admin, Manager, Author sở hữu)',
    description:
      'Admin xóa tác phẩm xử lý vi phạm. Manager xóa quản lý nội dung. Author chỉ xóa tác phẩm của chính mình.',
  })
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.storiesService.delete(req.user, id);
  }
}
