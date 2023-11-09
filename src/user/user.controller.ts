import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id/profile')
  async getUserProfile(@Param('id') id: string) {
    return await this.userService.getUserProfile(id);
  }

  @UseGuards(JwtGuard)
  @Get('/current-user')
  async getCurrentUser(@Req() req: any) {
    return await this.userService.getCurrentUser(req.user.id);
  }
}
