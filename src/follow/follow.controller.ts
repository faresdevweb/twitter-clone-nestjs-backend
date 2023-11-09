import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('follow')
export class FollowController {
    constructor(private followService: FollowService){}

    @UseGuards(JwtGuard)
    @Post('/:userId')
    async follow(@Param('userId') userId: string, @Req() req: any){
        return this.followService.follow(userId, req.user);
    }

    @UseGuards(JwtGuard)
    @Get('/followers/:userId')
    async getFollowers(@Param('userId') userId: string){
        return this.followService.getFollowers(userId);
    }
    
    @UseGuards(JwtGuard)
    @Get('/following/:userId')
    async getFollowing(@Param('userId') userId: string){
        return this.followService.getFollowing(userId);
    }

}
