import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CloudinaryService,
  type UploadFile,
  type UploadImageOptions,
  type UploadImageResult,
} from './cloudinary.service.js';
import { LocalStorageService } from './local-storage.service.js';

export type StorageMode = 'local' | 'cloud';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly localStorageService: LocalStorageService,
  ) {
    this.logger.log(`Storage service initialized with mode: [${this.getMode().toUpperCase()}]`);
  }

  getMode(): StorageMode {
    const rawMode = (this.configService.get<string>('STORAGE_MODE') || 'local').toLowerCase().trim();
    return rawMode === 'cloud' || rawMode === 'cloudinary' ? 'cloud' : 'local';
  }

  async uploadImage(
    file: UploadFile,
    options?: UploadImageOptions,
  ): Promise<UploadImageResult & { mode: StorageMode }> {
    const mode = this.getMode();
    const result =
      mode === 'cloud'
        ? await this.cloudinaryService.uploadImage(file, options)
        : await this.localStorageService.uploadImage(file, options);

    return {
      ...result,
      mode,
    };
  }

  async deleteImage(publicIdOrUrl: string) {
    if (!publicIdOrUrl) return null;

    if (publicIdOrUrl.includes('cloudinary.com') || publicIdOrUrl.startsWith('storyvn/')) {
      return this.cloudinaryService.deleteImage(publicIdOrUrl);
    }
    if (publicIdOrUrl.includes('/uploads/') || publicIdOrUrl.includes('.')) {
      return this.localStorageService.deleteImage(publicIdOrUrl);
    }
    if (this.getMode() === 'cloud') {
      return this.cloudinaryService.deleteImage(publicIdOrUrl);
    }
    return this.localStorageService.deleteImage(publicIdOrUrl);
  }
}
