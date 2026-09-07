import { forwardRef, Global, Module } from '@nestjs/common';
import { CloudinaryService } from './service/cloudinary.service.js';
import { CloudinaryController } from './cloudinary.controller.js';
import { LocalStorageService } from './service/local-storage.service.js';
import { StorageService } from './service/storage.service.js';
import { UploadRateLimitGuard } from './guards/upload-rate-limit.guard.js';
import { AuthModule } from '../../modules/auth/auth.module.js';

@Global()
@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, LocalStorageService, StorageService, UploadRateLimitGuard],
  exports: [CloudinaryService, LocalStorageService, StorageService, UploadRateLimitGuard],
})
export class CloudinaryModule {}
