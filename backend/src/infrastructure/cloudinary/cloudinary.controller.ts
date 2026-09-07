import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StorageService } from './service/storage.service.js';
import { UploadFolder, UploadImageDto } from './dto/upload-image.dto.js';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard.js';
import { UploadRateLimitGuard } from './guards/upload-rate-limit.guard.js';

const ALLOWED_IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, UploadRateLimitGuard)
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly storageService: StorageService) {}

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Tải lên hình ảnh (Bắt buộc đăng nhập & Giới hạn tần suất Rate Limiting)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Tệp hình ảnh (JPEG, PNG, WEBP, GIF, SVG, tối đa 10MB)',
        },
        folder: {
          type: 'string',
          enum: Object.values(UploadFolder),
          default: UploadFolder.COMMON,
          description: 'Thư mục lưu trữ hình ảnh',
          example: UploadFolder.AVATARS,
        },
      },
      required: ['file'],
    },
  })
  async uploadImage(
    @UploadedFile() file: any,
    @Body() dto: UploadImageDto,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp hình ảnh để tải lên');
    }

    if (!ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Định dạng tệp không được hỗ trợ. Chỉ chấp nhận các tệp hình ảnh: JPG, PNG, WEBP, GIF, SVG.',
      );
    }

    if (file.size && file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException('Dung lượng tệp vượt quá kích thước cho phép (tối đa 10MB)');
    }

    const folder = dto?.folder || UploadFolder.COMMON;
    const result = await this.storageService.uploadImage(file, { folder });

    return {
      success: true,
      message: 'Upload ảnh thành công',
      data: {
        url: result.url,
        publicId: result.publicId,
        storageMode: result.mode,
      },
    };
  }

  @Delete('image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa hình ảnh (Bắt buộc đăng nhập & Giới hạn tần suất Rate Limiting)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        publicId: {
          type: 'string',
          description: 'publicId hoặc URL của ảnh cần xóa',
          example: 'avatars/kiem-lai-chuong-1-1725638400000-a1b2c3.png',
        },
      },
      required: ['publicId'],
    },
  })
  async deleteImage(@Body('publicId') publicId: string) {
    if (!publicId?.trim()) {
      throw new BadRequestException('Vui lòng cung cấp publicId hoặc URL của hình ảnh cần xóa');
    }

    const result = await this.storageService.deleteImage(publicId.trim());

    return {
      success: true,
      message: 'Xóa ảnh thành công',
      data: result,
    };
  }
}
