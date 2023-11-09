import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}


  async getNotifications(userId: string){
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  }


  async createNotification(userId: string, message: string, postId?: string){
    const notification = await this.prisma.notification.create({
      data: {
        body: message,
        userId: userId,
        postId: postId,
      }
    })
    return notification;
  }

  async deleteNotification(userId: string, postId?: string){
    const notification = await this.prisma.notification.findFirst({
      where: {
        userId: userId,
        postId: postId,
      }
    });
  
    if (!notification) throw new NotFoundException('Notification not found');
    
    return this.prisma.notification.delete({
      where: {
        id: notification.id,
      }
    });
  }
  

}
