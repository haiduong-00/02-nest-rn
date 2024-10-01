
import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard) // no call toi Passport cua local.strategy.ts de get req(bao gom user) truoc khi vao controller
  @Post("login")
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard) // no call toi JwtStrategy extends PassportStrategy truoc khi vao controller
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}