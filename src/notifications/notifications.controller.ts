import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService){}


  @UseGuards(JwtGuard)
  @Get()
  async getNotifications(
    @Req() req: any,
  ) {
    return await this.notificationsService.getNotifications(req.user.id);
  }
}
