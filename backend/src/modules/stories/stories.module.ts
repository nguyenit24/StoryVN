import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './schemas/story.schema.js';
import { Category, CategorySchema } from '../categories/schemas/category.schema.js';
import { Tag, TagSchema } from '../tags/schemas/tag.schema.js';
import { User, UserSchema } from '../users/schemas/user.schema.js';
import { StoriesService } from './services/stories.service.js';
import { StoriesController } from './controllers/stories.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [StoriesController],
  providers: [StoriesService, RolesGuard],
  exports: [MongooseModule, StoriesService],
})
export class StoriesModule {}
