import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema.js';
import { AuthorProfile, AuthorProfileSchema } from '../authors/schemas/author-profile.schema.js';
import { UsersService } from './services/users.service.js';
import { UsersController } from './controllers/users.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthorProfile.name, schema: AuthorProfileSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard],
  exports: [MongooseModule, UsersService, RolesGuard],
})
export class UsersModule {}
