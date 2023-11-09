import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtGuard } from 'src/auth/guard';
import { CreatePostDTO } from './dto/post.dto';


@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtGuard)
  @Post('/createPost')
  async createPost(@Body() body: CreatePostDTO, @Req() req: any) {
    return this.postsService.createPost(body, req.user.id);
  }

  @Get('/all')
  async getAllPosts() {
    return this.postsService.getPosts();
  }

  @Get('/get-single-post/:id')
  async getSinglePost(@Param('id') postId: string) {
    return this.postsService.getSinglePost(postId);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getPosts(@Query('page') page: number) {
    return this.postsService.getPosts(page);
  }

  @UseGuards(JwtGuard)
  @Post(':id/likePost')
  async likePost(@Param('id') postId: string, @Req() req: any) {
    return this.postsService.likePost(postId, req.user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/repostPost')
  async repostPost(@Param('id') postId: string, @Req() req: any) {
    return this.postsService.repostPost(postId, req.user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/deletePost')
  async deletePost(@Param('id') postId: string, @Req() req: any) {
    return this.postsService.deletePost(postId, req.user.id);
  }
}
