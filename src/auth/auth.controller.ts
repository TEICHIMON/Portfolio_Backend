import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('api/register')
  async register(@Body() createUserDto: CreateAuthDto) {
    console.log('register', createUserDto);
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('api/login')
  async login(@Request() req) {
    console.log(req.user, 'req in login');
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/profile')
  getProfile(@Request() req) {
    console.log(req.user, 'req');
    return req.user;
  }
}
