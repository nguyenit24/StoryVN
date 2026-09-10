import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schemas/tag.schema.js';
import { Story, StorySchema } from '../stories/schemas/story.schema.js';
import { TagsService } from './services/tags.service.js';
import { TagsController } from './controllers/tags.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Story.name, schema: StorySchema },
    ]),
    AuthModule,
  ],
  controllers: [TagsController],
  providers: [TagsService, RolesGuard],
  exports: [MongooseModule, TagsService],
})
export class TagsModule {}
