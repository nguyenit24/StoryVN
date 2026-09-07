import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum UploadFolder {
  AVATARS = 'avatars',
  COVERS = 'covers',
  CHAPTERS = 'chapters',
  BANNERS = 'banners',
  COMMON = 'common',
}

export class UploadImageDto {
  @ApiPropertyOptional({
    enum: UploadFolder,
    default: UploadFolder.COMMON,
    description: 'Thư mục phân loại lưu trữ hình ảnh (avatars, covers, chapters, banners, common)',
    example: UploadFolder.AVATARS,
  })
  @IsOptional()
  @IsEnum(UploadFolder, {
    message: 'Thư mục không hợp lệ. Các thư mục cho phép: avatars, covers, chapters, banners, common',
  })
  folder?: UploadFolder = UploadFolder.COMMON;
}
