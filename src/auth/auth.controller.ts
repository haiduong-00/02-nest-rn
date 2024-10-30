
import { Controller, Post, UseGuards, Request, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CodeAuthDto } from './dto/code-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService
  ) { }

  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard) // no call toi Passport cua local.strategy.ts de get req(bao gom user) truoc khi vao controller
  @ResponseMessage("Fetch login") // bổ sung message trong data gửi lên Front-end khi login successfull
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard) // no call toi JwtStrategy extends PassportStrategy truoc khi vao controller
  // thay bang Globle Guard tron app.module.ts
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() codeDto: CodeAuthDto) {
    return this.authService.checkCode(codeDto);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService
      .sendMail({
        to: 'dinhhaiduong203@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register',
        context: {
          name: 'DuHa',
          activationCode: 123456789
        }
      })
    return "ok"
  }
}