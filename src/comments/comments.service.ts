import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDTO } from './dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService, private notificationsService: NotificationsService) {}

  async getComments(postId: string) {
    return this.prismaService.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async createComment(commentDTO: CommentDTO, userId: string, postId: string) {
    // récupérer le post
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return this.prismaService.comment.create({
      data: {
        body: commentDTO.body,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async likeComment(user: User, commentId: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    const isUserLiked = comment.likedIds.includes(user.id);
    let message: string;
    if (isUserLiked) {
      await this.notificationsService.deleteNotification(user.id, comment.id);
      return this.prismaService.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likedIds: {
            set: comment.likedIds.filter((id) => id !== user.id),
          },
        },
      });
    } else {
      message = `${user.username} liked your comment`;
      this.notificationsService.createNotification(user.id, message, comment.id);
      return this.prismaService.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likedIds: {
            set: [...comment.likedIds, user.id],
          },
        },
      });
    }
  }

  async repostComment(user: User, commentId: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    const isUserReposted = comment.repostedIds.includes(user.id);
    let message: string;
    if (isUserReposted) {
      await this.notificationsService.deleteNotification(user.id, comment.id);
      return this.prismaService.comment.update({
        where: {
          id: commentId,
        },
        data: {
          repostedIds: {
            set: comment.repostedIds.filter((id) => id !== user.id),
          },
        },
      });
    } else {
      message = `${user.username} reposted your comment`;
      this.notificationsService.createNotification(user.id, message, comment.id);
      return this.prismaService.comment.update({
        where: {
          id: commentId,
        },
        data: {
          repostedIds: {
            set: [...comment.repostedIds, user.id],
          },
        },
      });
    }
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (comment.userId !== userId)
      throw new NotFoundException('Comment not found');

    return this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
