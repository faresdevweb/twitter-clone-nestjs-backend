import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  providers: [CommentsService, NotificationsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
