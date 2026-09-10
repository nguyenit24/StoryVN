import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema.js';
import { Story, StoryDocument } from '../../stories/schemas/story.schema.js';
import { CreateCategoryDto } from '../dto/create-category.dto.js';
import { UpdateCategoryDto } from '../dto/update-category.dto.js';
import { slugify } from '../../../common/utils/slug.utils.js';
import { escapeRegex } from '../../../common/utils/regex.utils.js';

import { QueryCategoriesDto } from '../dto/query-categories.dto.js';
import { SEED_CATEGORIES } from '../constants/seed-categories.data.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Story.name)
    private readonly storyModel: Model<StoryDocument>,
  ) {}

  async findAll(query: QueryCategoriesDto): Promise<{
    data: CategoryDocument[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const filter: Record<string, any> = {};

    if (query.search?.trim()) {
      const regex = {
        $regex: escapeRegex(query.search.trim()),
        $options: 'i',
      };
      filter.$or = [{ name: regex }, { slug: regex }, { description: regex }];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.categoryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.categoryModel.countDocuments(filter).exec(),
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

  async create(dto: CreateCategoryDto): Promise<CategoryDocument> {
    const trimmedName = dto.name.trim();

    const existingName = await this.categoryModel
      .findOne({
        name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
      })
      .exec();

    if (existingName) {
      throw new ConflictException('Tên thể loại đã tồn tại');
    }

    const baseSlug = slugify(trimmedName) || 'the-loai';
    let slug = baseSlug;
    let count = 1;
    while (await this.categoryModel.exists({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const category = new this.categoryModel({
      name: trimmedName,
      slug,
      description: dto.description?.trim() || null,
    });

    return category.save();
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID thể loại không hợp lệ');
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Không tìm thấy thể loại');
    }

    if (dto.name) {
      const trimmedName = dto.name.trim();
      if (trimmedName.toLowerCase() !== category.name.toLowerCase()) {
        const existingName = await this.categoryModel
          .findOne({
            _id: { $ne: id },
            name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
          })
          .exec();

        if (existingName) {
          throw new ConflictException('Tên thể loại đã tồn tại');
        }
      }

      category.name = trimmedName;

      // Tự động cập nhật slug theo tên mới
      const baseSlug = slugify(trimmedName) || 'the-loai';
      let slug = baseSlug;
      let count = 1;
      while (await this.categoryModel.exists({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }
      category.slug = slug;
    }

    if (dto.description !== undefined) {
      category.description = dto.description?.trim() || null;
    }

    return category.save();
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID thể loại không hợp lệ');
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Không tìm thấy thể loại');
    }

    const isUsed = await this.storyModel
      .exists({ categoryIds: new Types.ObjectId(id) })
      .exec();

    if (isUsed) {
      throw new BadRequestException(
        'Không thể xóa thể loại đang được sử dụng trong tác phẩm',
      );
    }

    await this.categoryModel.findByIdAndDelete(id).exec();
    return { message: 'Xóa thể loại thành công' };
  }

  async seedCategories(): Promise<{
    count: number;
    message: string;
    totalCategories: number;
  }> {
    let createdCount = 0;

    for (const item of SEED_CATEGORIES) {
      const trimmedName = item.name.trim();
      const existing = await this.categoryModel
        .findOne({
          name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') },
        })
        .exec();

      if (!existing) {
        const baseSlug = slugify(trimmedName) || 'the-loai';
        let slug = baseSlug;
        let count = 1;
        while (await this.categoryModel.exists({ slug })) {
          slug = `${baseSlug}-${count}`;
          count++;
        }

        await this.categoryModel.create({
          name: trimmedName,
          slug,
          description: item.description,
        });
        createdCount++;
      }
    }

    const totalCategories = await this.categoryModel.countDocuments().exec();
    return {
      count: createdCount,
      message:
        createdCount > 0
          ? `Khởi tạo thành công ${createdCount} thể loại mẫu mới!`
          : 'Dữ liệu thể loại đã đầy đủ, không có thể loại nào mới cần thêm.',
      totalCategories,
    };
  }
}
