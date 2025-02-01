import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { RegisterDto } from '../../auth/src/dto/register.dto';
import { AuthGuard } from '@app/common';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @MessagePattern('user.id')
  async findOneMessage(@Payload() userId: number) {
    return await this.usersService.findOne(+userId);
  }

  @MessagePattern('user.findByEmail')
  async findByEmailMessage(
    @Payload() data: { email: string; selectPassword: boolean },
  ) {
    return await this.usersService.findByEmail(data.email, data.selectPassword);
  }

  @MessagePattern('user.create')
  async createUser(@Payload() payload: RegisterDto) {
    return await this.usersService.createUser(payload);
  }
}
