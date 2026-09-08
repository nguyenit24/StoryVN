import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthorProfile, AuthorProfileSchema } from './schemas/author-profile.schema.js';
import { AuthorsController } from './controllers/authors.controller.js';
import { AuthorsService } from './services/authors.service.js';
import { User, UserSchema } from '../users/schemas/user.schema.js';
import { RolesModule } from '../roles/roles.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthorProfile.name, schema: AuthorProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [AuthorsController],
  providers: [AuthorsService, RolesGuard],
  exports: [MongooseModule, AuthorsService],
})
export class AuthorsModule {}
