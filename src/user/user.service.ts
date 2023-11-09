import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany();

    for (const user of users) {
      delete user.hashedPassword;
    }

    return users;
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    delete user.hashedPassword;

    return user;
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        profileImage: true,
        coverImage: true,
        bio: true,
        followerIds: true,
        followingIds: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    // Récupérer les posts de l'utilisateur
    const posts = await this.prisma.post.findMany({
      where: { userId },
    });

    // Récupérer les commentaires de l'utilisateur
    const comments = await this.prisma.comment.findMany({
      where: { userId },
    });

    // Pour les posts likés et repostés, vous pouvez essayer quelque chose comme ceci
    // (assurez-vous que votre base de données supporte ces opérations) :
    const likedPosts = await this.prisma.post.findMany({
      where: {
        likedIds: { has: userId },
      },
    });

    const repostedPosts = await this.prisma.post.findMany({
      where: {
        repostedIds: { has: userId },
      },
    });

    // Rassembler toutes les informations dans un seul objet
    return {
      user,
      posts,
      comments,
      likedPosts,
      repostedPosts,
    };
  }
}
