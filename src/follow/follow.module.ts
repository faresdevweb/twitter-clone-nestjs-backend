import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  providers: [FollowService, NotificationsService],
  controllers: [FollowController]
})
export class FollowModule {}
