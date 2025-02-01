import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@app/common/config/config.service';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

import { UserNotFoundByCredentialsError } from './errors/userNotFound.error';
import { EmailIsTakenError } from '@app/common/errors/EmailIsTaken.error';
import { RequestUser } from '@app/common/interfaces/http';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { getClientName } from '@app/common';
import { ServiceNames } from '@app/common/constants/microservice';
import { User } from 'apps/user/src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(getClientName(ServiceNames.USER_SERVICE))
    private userClient: ClientProxy,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(registerDto: RegisterDto) {
    const emailIsTaken = await firstValueFrom(
      this.userClient.send('user.findByEmail', {
        email: registerDto.email,
      }),
    );
    if (emailIsTaken) {
      throw EmailIsTakenError;
    }
    return await firstValueFrom(
      this.userClient.send('user.create', registerDto),
    );
  }

  async login(loginDto: LoginDto) {
    const user: User = await firstValueFrom(
      this.userClient.send('user.findByEmail', {
        email: loginDto.email,
        selectPassword: true,
      }),
    );
    if (!user) {
      throw UserNotFoundByCredentialsError;
    }
    const passwordsMatch: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordsMatch) {
      throw UserNotFoundByCredentialsError;
    }
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    delete user.password;
    return {
      user,
      token,
    };
  }

  async me(user: RequestUser): Promise<User> {
    return (await firstValueFrom(
      this.userClient.send('user.id', user.id),
    )) as User;
  }

  async validateToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.getJWTSecret(),
    });
  }
}
