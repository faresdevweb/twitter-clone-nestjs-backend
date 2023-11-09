import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ){}

    async follow(userId: string, user: User){
        if(userId === user.id) throw new BadRequestException("You can't follow yourself");

        const userToFollow = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!userToFollow) throw new NotFoundException("User not found");

        const alreadyFollowed = userToFollow.followerIds.includes(user.id);
        let message: string;
        if(alreadyFollowed){
            // supprime le follow
            await this.notificationsService.deleteNotification(userToFollow.id);
            await this.prisma.user.update({
                where: {
                    id: userToFollow.id
                },
                data: {
                    followerIds: {
                        set: userToFollow.followerIds.filter(id => id !== user.id)
                    }
                }
            })
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    followingIds: {
                        set: user.followingIds.filter(id => id !== userToFollow.id)
                    }
                }
            })
        } else {
            // ajoute le follow
            message = `${user.username} started following you`;
            await this.notificationsService.createNotification(userToFollow.id, message);
            await this.prisma.user.update({
                where: {
                    id: userToFollow.id
                },
                data: {
                    followerIds: {
                        push: user.id
                    }
                }
            })
            await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    followingIds: {
                        push: userToFollow.id
                    }
                }
            })
        }
    }

    async getFollowers(userId: string){
        const followers = await this.prisma.user.findMany({
            where: {
                followingIds: {
                    has: userId
                }
            }
        });

        for(const user of followers){
            delete user.hashedPassword;
        }

        return followers;
    }

    async getFollowing(userId: string){
        const following = await this.prisma.user.findMany({
            where: {
                followerIds: {
                    has: userId
                }
            }
        });

        for(const user of following){
            delete user.hashedPassword;
        }

        return following;
    }
}
