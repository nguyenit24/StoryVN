import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { Readable } from 'node:stream';
import * as path from 'node:path';
import { generateSlugWithSuffix } from '../../../common/utils/slug.utils.js';

export interface UploadImageOptions {
  folder?: string;
  customName?: string;
}

export interface UploadFile {
  buffer: Buffer;
  [key: string]: any;
}

export interface UploadImageResult {
  url: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async uploadImage(file: UploadFile, options?: UploadImageOptions): Promise<UploadImageResult> {
    if (!file?.buffer) {
      throw new BadRequestException('File không hợp lệ hoặc thiếu buffer dữ liệu');
    }

    const rawFolder = options?.folder?.trim() || 'common';
    const folder = rawFolder.startsWith('storyvn') ? rawFolder : `storyvn/${rawFolder}`;

    const originalBaseName = file.originalname ? path.parse(file.originalname).name : undefined;
    const public_id = generateSlugWithSuffix(options?.customName || originalBaseName);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id,
          resource_type: 'image',
        },
        (error, res) => {
          if (error || !res) return reject(error);
          resolve(res);
        },
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async deleteImage(publicIdOrUrl: string) {
    if (!publicIdOrUrl) return null;

    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.startsWith('http')) {
      const match = publicIdOrUrl.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
      if (match) publicId = match[1];
    }

    return cloudinary.uploader.destroy(publicId);
  }
}
