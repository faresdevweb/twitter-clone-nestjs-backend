import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get('verify-token')
  verifyToken() {
    return { success: true };
  }

  @Post('/signup')
  signup(@Body() dto: AuthDTO) {
    return this.authService.signup(dto);
  }
  @Post('/signin')
  signin(@Body() dto: AuthDTO) {
    return this.authService.signin(dto);
  }
}
