import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { handleError } from '@app/common/errors/handler';
import { AuthorizedRequest } from '@app/common/interfaces/http';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from 'apps/user/src/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(registerDto);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (err: unknown) {
      handleError(res, err);
    }
  }

  @Post('/login')
  async findAll(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const loginInfo = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json(loginInfo);
    } catch (err) {
      handleError(res, err);
    }
  }

  @ApiBearerAuth()
  @Get('/me')
  async findOne(@Req() req: AuthorizedRequest, @Res() res: Response) {
    try {
      const user: User = await this.authService.me(req.user);
      return res.status(HttpStatus.OK).json(user);
    } catch (err) {
      handleError(res, err);
    }
  }

  @MessagePattern('auth.validateToken')
  async validateToken(@Payload() token: string) {
    return await this.authService.validateToken(token);
  }
}
