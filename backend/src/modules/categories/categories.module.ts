import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema.js';
import { Story, StorySchema } from '../stories/schemas/story.schema.js';
import { CategoriesService } from './services/categories.service.js';
import { CategoriesController } from './controllers/categories.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Story.name, schema: StorySchema },
    ]),
    AuthModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, RolesGuard],
  exports: [MongooseModule, CategoriesService],
})
export class CategoriesModule {}
