import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, NotificationsService],
})
export class PostsModule {}
