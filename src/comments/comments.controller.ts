import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDTO } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/:id')
  async getComments(@Param('postId') postId: string) {
    return this.commentsService.getComments(postId);
  }

  @Post(':id/createComment')
  async createComment(
    @Body() commentDTO: CommentDTO,
    @Req() req: any,
    @Param('id') postId: string,
  ) {
    return this.commentsService.createComment(commentDTO, req.user.id, postId);
  }

  @Post(':id/likeComment')
  async likeComment(@Req() req: any, @Param('id') commentId: string) {
    return this.commentsService.likeComment(req.user, commentId);
  }

  @Post(':id/repostComment')
  async repostComment(@Req() req: any, @Param('id') commentId: string) {
    return this.commentsService.repostComment(req.user, commentId);
  }

  @Delete(':id/deleteComment')
  async deleteComment(@Req() req: any, @Param('id') commentId: string) {
    return this.commentsService.deleteComment(req.user.id, commentId);
  }
}
