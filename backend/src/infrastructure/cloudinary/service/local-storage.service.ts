import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { generateSlugWithSuffix } from '../../../common/utils/slug.utils.js';
import type { UploadFile, UploadImageOptions, UploadImageResult } from './cloudinary.service.js';

@Injectable()
export class LocalStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(file: UploadFile, options?: UploadImageOptions): Promise<UploadImageResult> {
    if (!file?.buffer) {
      throw new BadRequestException('File không hợp lệ hoặc thiếu buffer dữ liệu');
    }

    const folder = options?.folder?.trim() || 'common';
    const targetDir = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetDir)) {
      await fs.promises.mkdir(targetDir, { recursive: true });
    }

    const ext = this.getFileExtension(file);
    const originalBaseName = file.originalname ? path.parse(file.originalname).name : undefined;
    const baseName = generateSlugWithSuffix(options?.customName || originalBaseName);

    const fileName = `${baseName}${ext}`;
    const filePath = path.join(targetDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    const relativePath = `${folder}/${fileName}`;
    const backendUrl = this.configService.get<string>('BACKEND_URL')?.replace(/\/+$/, '') || '';
    const url = backendUrl ? `${backendUrl}/uploads/${relativePath}` : `/uploads/${relativePath}`;

    return {
      url,
      publicId: relativePath,
    };
  }

  async deleteImage(publicIdOrUrl: string) {
    if (!publicIdOrUrl) return null;

    let relativePath = publicIdOrUrl.trim();

    if (relativePath.startsWith('http')) {
      const index = relativePath.indexOf('/uploads/');
      if (index !== -1) {
        relativePath = relativePath.slice(index + '/uploads/'.length);
      }
    }

    relativePath = relativePath.replace(/^\/?uploads\//, '');

    const filePath = path.resolve(this.uploadDir, relativePath);

    if (!filePath.startsWith(this.uploadDir)) {
      this.logger.warn(`Phát hiện đường dẫn không hợp lệ: ${publicIdOrUrl}`);
      return null;
    }

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.log(`Đã xóa file local: ${filePath}`);
        return { result: 'ok' };
      }
      return { result: 'not_found' };
    } catch (err: any) {
      this.logger.error(`Lỗi khi xóa file local ${filePath}: ${err?.message || err}`);
      return { result: 'error', error: err?.message };
    }
  }

  private getFileExtension(file: UploadFile): string {
    if (file.originalname) {
      const ext = path.extname(file.originalname);
      if (ext) return ext.toLowerCase();
    }
    if (file.mimetype) {
      const parts = file.mimetype.split('/');
      if (parts.length > 1) {
        const sub = parts[1].toLowerCase();
        if (sub === 'jpeg') return '.jpg';
        return `.${sub}`;
      }
    }
    return '.png';
  }
}
