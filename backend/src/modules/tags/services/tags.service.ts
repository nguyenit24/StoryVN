import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag, TagDocument } from '../schemas/tag.schema.js';
import { Story, StoryDocument } from '../../stories/schemas/story.schema.js';
import { CreateTagDto } from '../dto/create-tag.dto.js';
import { UpdateTagDto } from '../dto/update-tag.dto.js';
import { slugify } from '../../../common/utils/slug.utils.js';
import { escapeRegex } from '../../../common/utils/regex.utils.js';
import { QueryTagsDto } from '../dto/query-tags.dto.js';
import { SEED_TAGS } from '../constants/seed-tags.data.js';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
    @InjectModel(Story.name)
    private readonly storyModel: Model<StoryDocument>,
  ) {}

  async findAll(query: QueryTagsDto): Promise<{
    data: TagDocument[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const filter: Record<string, any> = {};

    if (query?.search?.trim()) {
      const regex = {
        $regex: escapeRegex(query.search.trim()),
        $options: 'i',
      };
      filter.$or = [{ name: regex }, { slug: regex }, { description: regex }];
    }

    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query?.limit) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.tagModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.tagModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateTagDto): Promise<TagDocument> {
    const trimmedName = dto.name.trim();

    const existingName = await this.tagModel
      .findOne({
        name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
      })
      .exec();

    if (existingName) {
      throw new ConflictException('Tên thẻ đã tồn tại');
    }

    const baseSlug = slugify(trimmedName) || 'the';
    let slug = baseSlug;
    let count = 1;
    while (await this.tagModel.exists({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const tag = new this.tagModel({
      name: trimmedName,
      slug,
      description: dto.description?.trim() || null,
    });

    return tag.save();
  }

  async update(id: string, dto: UpdateTagDto): Promise<TagDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID thẻ không hợp lệ');
    }

    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException('Không tìm thấy thẻ');
    }

    if (dto.name) {
      const trimmedName = dto.name.trim();
      if (trimmedName.toLowerCase() !== tag.name.toLowerCase()) {
        const existingName = await this.tagModel
          .findOne({
            _id: { $ne: id },
            name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
          })
          .exec();

        if (existingName) {
          throw new ConflictException('Tên thẻ đã tồn tại');
        }
      }

      tag.name = trimmedName;

      // Tự động cập nhật slug theo tên mới
      const baseSlug = slugify(trimmedName) || 'the';
      let slug = baseSlug;
      let count = 1;
      while (await this.tagModel.exists({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }
      tag.slug = slug;
    }

    if (dto.description !== undefined) {
      tag.description = dto.description?.trim() || null;
    }

    return tag.save();
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID thẻ không hợp lệ');
    }

    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException('Không tìm thấy thẻ');
    }

    const isUsed = await this.storyModel
      .exists({ tagIds: new Types.ObjectId(id) })
      .exec();

    if (isUsed) {
      throw new BadRequestException(
        'Không thể xóa thẻ đang được sử dụng trong tác phẩm',
      );
    }

    await this.tagModel.findByIdAndDelete(id).exec();
    return { message: 'Xóa thẻ thành công' };
  }

  async seedTags(): Promise<{
    count: number;
    message: string;
    totalTags: number;
  }> {
    let createdCount = 0;

    for (const item of SEED_TAGS) {
      const trimmedName = item.name.trim();
      const existing = await this.tagModel
        .findOne({
          name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
        })
        .exec();

      if (!existing) {
        const baseSlug = slugify(trimmedName) || 'the';
        let slug = baseSlug;
        let count = 1;
        while (await this.tagModel.exists({ slug })) {
          slug = `${baseSlug}-${count}`;
          count++;
        }

        await this.tagModel.create({
          name: trimmedName,
          slug,
          description: item.description,
        });
        createdCount++;
      }
    }

    const totalTags = await this.tagModel.countDocuments().exec();
    return {
      count: createdCount,
      message:
        createdCount > 0
          ? `Khởi tạo thành công ${createdCount} thẻ tag mẫu mới!`
          : 'Dữ liệu thẻ tag đã đầy đủ, không có thẻ tag nào mới cần thêm.',
      totalTags,
    };
  }
}
