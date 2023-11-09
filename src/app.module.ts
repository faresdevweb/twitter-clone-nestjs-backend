import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { FollowModule } from './follow/follow.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    PostsModule,
    NotificationsModule,
    CommentsModule,
    UserModule,
    ProfileModule,
    FollowModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [PrismaService, NotificationsService],
})
export class AppModule {}
