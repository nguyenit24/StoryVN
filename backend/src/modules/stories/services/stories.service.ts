import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Story, StoryDocument, StoryStatus } from '../schemas/story.schema.js';
import { Category, CategoryDocument } from '../../categories/schemas/category.schema.js';
import { Tag, TagDocument } from '../../tags/schemas/tag.schema.js';
import { User, UserDocument } from '../../users/schemas/user.schema.js';
import { CreateStoryDto } from '../dto/create-story.dto.js';
import { UpdateStoryDto } from '../dto/update-story.dto.js';
import { QueryMyStoriesDto } from '../dto/query-my-stories.dto.js';
import { QueryAdminStoriesDto } from '../dto/query-admin-stories.dto.js';
import { RoleType } from '../../roles/schemas/role.schema.js';
import { slugify } from '../../../common/utils/slug.utils.js';
import { escapeRegex } from '../../../common/utils/regex.utils.js';

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story.name)
    private readonly storyModel: Model<StoryDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findAllForAdmin(query: QueryAdminStoriesDto): Promise<{
    data: StoryDocument[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const filter: Record<string, any> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.isVip !== undefined) {
      filter.isVip = query.isVip;
    }

    if (query.search) {
      filter.title = {
        $regex: escapeRegex(query.search.trim()),
        $options: 'i',
      };
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      this.storyModel
        .find(filter)
        .populate('authorId', 'username displayName avatar email')
        .populate('categoryIds', 'name slug')
        .populate('tagIds', 'name slug')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.storyModel.countDocuments(filter).exec(),
    ]);

    return {
      data: stories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(
    user: { userId: string; role: string },
    dto: CreateStoryDto,
  ): Promise<StoryDocument> {
    if (user.role === RoleType.ADMIN) {
      throw new ForbiddenException('Admin không có quyền tạo tác phẩm');
    }

    let authorId: Types.ObjectId;

    if (user.role === RoleType.AUTHOR) {
      authorId = new Types.ObjectId(user.userId);
    } else if (user.role === RoleType.MANAGER) {
      if (dto.authorId) {
        if (!Types.ObjectId.isValid(dto.authorId)) {
          throw new BadRequestException('ID tác giả không hợp lệ');
        }
        const authorExists = await this.userModel.exists({ _id: dto.authorId }).exec();
        if (!authorExists) {
          throw new NotFoundException('Tài khoản tác giả không tồn tại');
        }
        authorId = new Types.ObjectId(dto.authorId);
      } else {
        authorId = new Types.ObjectId(user.userId);
      }
    } else {
      throw new ForbiddenException('Bạn không có quyền tạo tác phẩm');
    }

    if (dto.categoryIds && dto.categoryIds.length > 0) {
      for (const catId of dto.categoryIds) {
        if (!Types.ObjectId.isValid(catId)) {
          throw new BadRequestException(`ID thể loại ${catId} không hợp lệ`);
        }
      }
      const catCount = await this.categoryModel
        .countDocuments({ _id: { $in: dto.categoryIds } })
        .exec();
      if (catCount !== dto.categoryIds.length) {
        throw new BadRequestException('Một hoặc nhiều thể loại không tồn tại');
      }
    }

    if (dto.tagIds && dto.tagIds.length > 0) {
      for (const tagId of dto.tagIds) {
        if (!Types.ObjectId.isValid(tagId)) {
          throw new BadRequestException(`ID thẻ ${tagId} không hợp lệ`);
        }
      }
      const tagCount = await this.tagModel
        .countDocuments({ _id: { $in: dto.tagIds } })
        .exec();
      if (tagCount !== dto.tagIds.length) {
        throw new BadRequestException('Một hoặc nhiều thẻ không tồn tại');
      }
    }

    const trimmedTitle = dto.title.trim();
    const baseSlug = slugify(trimmedTitle) || 'tac-pham';
    let slug = baseSlug;
    let count = 1;
    while (await this.storyModel.exists({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const story = new this.storyModel({
      authorId,
      title: trimmedTitle,
      slug,
      description: dto.description?.trim() || null,
      coverUrl: dto.coverUrl?.trim() || null,
      status: dto.status || StoryStatus.DRAFT,
      isVip: dto.isVip ?? false,
      categoryIds: dto.categoryIds?.map((id) => new Types.ObjectId(id)) || [],
      tagIds: dto.tagIds?.map((id) => new Types.ObjectId(id)) || [],
    });

    const savedStory = await story.save();
    return this.storyModel
      .findById(savedStory._id)
      .populate('categoryIds', 'name slug')
      .populate('tagIds', 'name slug')
      .exec() as Promise<StoryDocument>;
  }

  async findMyStories(
    userId: string,
    query: QueryMyStoriesDto,
  ): Promise<{
    data: StoryDocument[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const filter: Record<string, any> = {
      authorId: new Types.ObjectId(userId),
    };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      filter.title = {
        $regex: escapeRegex(query.search.trim()),
        $options: 'i',
      };
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      this.storyModel
        .find(filter)
        .populate('categoryIds', 'name slug')
        .populate('tagIds', 'name slug')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.storyModel.countDocuments(filter).exec(),
    ]);

    return {
      data: stories,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findMyStoryBySlug(userId: string, slug: string): Promise<StoryDocument> {
    const trimmedSlug = slug?.toLowerCase().trim();
    if (!trimmedSlug) {
      throw new BadRequestException('Slug tác phẩm không hợp lệ');
    }

    const story = await this.storyModel
      .findOne({
        slug: trimmedSlug,
        authorId: new Types.ObjectId(userId),
      })
      .populate('categoryIds', 'name slug description')
      .populate('tagIds', 'name slug description')
      .exec();

    if (!story) {
      throw new NotFoundException(
        'Không tìm thấy tác phẩm hoặc bạn không có quyền truy cập',
      );
    }

    return story;
  }

  async update(
    user: { userId: string; role: string },
    id: string,
    dto: UpdateStoryDto,
  ): Promise<StoryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID tác phẩm không hợp lệ');
    }

    const story = await this.storyModel.findById(id).exec();
    if (!story) {
      throw new NotFoundException('Không tìm thấy tác phẩm');
    }

    if (user.role === RoleType.ADMIN) {
      throw new ForbiddenException('Admin không có quyền chỉnh sửa tác phẩm');
    }

    if (
      user.role === RoleType.AUTHOR &&
      story.authorId.toString() !== user.userId
    ) {
      throw new ForbiddenException(
        'Bạn chỉ có quyền chỉnh sửa tác phẩm của chính mình',
      );
    }

    if (dto.title) {
      const trimmedTitle = dto.title.trim();
      if (trimmedTitle !== story.title) {
        story.title = trimmedTitle;

        // Tự động cập nhật slug theo tiêu đề mới
        const baseSlug = slugify(trimmedTitle) || 'tac-pham';
        let slug = baseSlug;
        let count = 1;
        while (await this.storyModel.exists({ slug, _id: { $ne: id } })) {
          slug = `${baseSlug}-${count}`;
          count++;
        }
        story.slug = slug;
      }
    }

    if (dto.categoryIds) {
      for (const catId of dto.categoryIds) {
        if (!Types.ObjectId.isValid(catId)) {
          throw new BadRequestException(`ID thể loại ${catId} không hợp lệ`);
        }
      }
      const catCount = await this.categoryModel
        .countDocuments({ _id: { $in: dto.categoryIds } })
        .exec();
      if (catCount !== dto.categoryIds.length) {
        throw new BadRequestException('Một hoặc nhiều thể loại không tồn tại');
      }
      story.categoryIds = dto.categoryIds.map((cId) => new Types.ObjectId(cId));
    }

    if (dto.tagIds) {
      for (const tagId of dto.tagIds) {
        if (!Types.ObjectId.isValid(tagId)) {
          throw new BadRequestException(`ID thẻ ${tagId} không hợp lệ`);
        }
      }
      const tagCount = await this.tagModel
        .countDocuments({ _id: { $in: dto.tagIds } })
        .exec();
      if (tagCount !== dto.tagIds.length) {
        throw new BadRequestException('Một hoặc nhiều thẻ không tồn tại');
      }
      story.tagIds = dto.tagIds.map((tId) => new Types.ObjectId(tId));
    }

    if (dto.description !== undefined) {
      story.description = dto.description?.trim() || null;
    }

    if (dto.coverUrl !== undefined) {
      story.coverUrl = dto.coverUrl?.trim() || null;
    }

    if (dto.status !== undefined) {
      story.status = dto.status;
    }

    if (dto.isVip !== undefined) {
      story.isVip = dto.isVip;
    }

    await story.save();

    return this.storyModel
      .findById(id)
      .populate('categoryIds', 'name slug')
      .populate('tagIds', 'name slug')
      .exec() as Promise<StoryDocument>;
  }

  async delete(
    user: { userId: string; role: string },
    id: string,
  ): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID tác phẩm không hợp lệ');
    }

    const story = await this.storyModel.findById(id).exec();
    if (!story) {
      throw new NotFoundException('Không tìm thấy tác phẩm');
    }

    if (
      user.role === RoleType.AUTHOR &&
      story.authorId.toString() !== user.userId
    ) {
      throw new ForbiddenException(
        'Bạn chỉ có quyền xóa tác phẩm của chính mình',
      );
    }

    await this.storyModel.findByIdAndDelete(id).exec();
    return { message: 'Xóa tác phẩm thành công' };
  }
}
