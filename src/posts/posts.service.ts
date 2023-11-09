import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDTO } from './dto/post.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) {}

  async getAllPosts(){
    return this.prisma.post.findMany({
      include: {
        comments: {
          select: {
            id: true,
          },
        },
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async getSinglePost(postId: string){
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            user: {
              select: {
                username: true,
                profileImage: true,
              },
            },
            likedIds: true,
            repostedIds: true,
            userId: true,
            postId: true,
          },
        },
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    return post;
  }

  async createPost(createPostDTO: CreatePostDTO, userId: string) {
    // trouve l'user qui fais la requête
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // si l'user n'existe pas, on renvoie une erreur
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // crée le post en renvoyant dans la data le username de l'user
    return this.prisma.post.create({
      data: {
        ...createPostDTO,
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

  async getPosts(page: number = 1) {
    const perPage = 10;
    const skip = (page - 1) * perPage;
    return this.prisma.post.findMany({
      skip,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        comments: {
          select: {
            id: true,
          },
        },
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async likePost(postId: string, user: User) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const isUserLiked = post.likedIds.includes(user.id);
    let message: string;
    if (isUserLiked) {
      // Si l'utilisateur a déjà liké le post, on le "unlike"
      await this.notificationsService.deleteNotification(user.id, postId);
      return this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likedIds: {
            set: post.likedIds.filter((id) => id !== user.id),
          },
        },
      });
    } else {
      // Si l'utilisateur n'a pas encore liké le post, on ajoute son ID à la liste des likes
      message = `${user.username} liked your post`;
      await this.notificationsService.createNotification(user.id, message, post.id);
      return this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likedIds: {
            set: [...post.likedIds, user.id],
          },
        },
      });
    }
  }

  async repostPost(postId: string, user: User) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const isUserReposted = post.repostedIds.includes(user.id);
    let message: string;
    if (isUserReposted) {
      await this.notificationsService.deleteNotification(user.id, postId);
      return this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          repostedIds: {
            set: post.repostedIds.filter((id) => id !== user.id),
          },
        },
      });
    } else {
      message = `${user.username} reposted your post`;
      await this.notificationsService.createNotification(user.id, message, post.id);
      return this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          repostedIds: {
            set: [...post.repostedIds, user.id],
          },
        },
      });
    }
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    if (post.userId !== userId) {
      throw new NotFoundException(
        `User with ID ${userId} not authorized to delete this post`,
      );
    }

    return this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
