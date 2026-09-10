import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { StoryStatus } from '../schemas/story.schema.js';

export class QueryMyStoriesDto {
  @ApiPropertyOptional({ example: 1, default: 1, description: 'Số trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page phải là số nguyên' })
  @Min(1, { message: 'page tối thiểu là 1' })
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, description: 'Số bản ghi mỗi trang (tối đa 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit phải là số nguyên' })
  @Min(1, { message: 'limit tối thiểu là 1' })
  @Max(100, { message: 'limit tối đa là 100' })
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Tìm kiếm theo tên tác phẩm' })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({ enum: StoryStatus, description: 'Lọc theo trạng thái tác phẩm' })
  @IsOptional()
  @IsEnum(StoryStatus, { message: 'Trạng thái tác phẩm không hợp lệ' })
  status?: StoryStatus;
}
