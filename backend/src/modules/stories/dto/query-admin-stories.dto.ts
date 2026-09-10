import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { StoryStatus } from '../schemas/story.schema.js';

export class QueryAdminStoriesDto {
  @ApiPropertyOptional({ example: 1, default: 1, description: 'Số trang' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page phải là số nguyên' })
  @Min(1, { message: 'page tối thiểu là 1' })
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, description: 'Số bản ghi mỗi trang (10, 20, 50, tối đa 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit phải là số nguyên' })
  @Min(1, { message: 'limit tối thiểu là 1' })
  @Max(100, { message: 'limit tối đa là 100' })
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Tìm kiếm theo tên tác phẩm' })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({ enum: StoryStatus, description: 'Lọc theo trạng thái tác phẩm' })
  @IsOptional()
  @IsEnum(StoryStatus, { message: 'Trạng thái tác phẩm không hợp lệ' })
  status?: StoryStatus;

  @ApiPropertyOptional({ type: Boolean, description: 'Lọc truyện VIP (true) hoặc truyện thường (false)' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'isVip phải là giá trị boolean' })
  isVip?: boolean;
}
