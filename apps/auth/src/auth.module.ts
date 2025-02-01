import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { createMicroserviceClientsConfig } from '@app/common/utils/helpers/client.helper';
import { DynamicConfigModule, ConfigService } from '@app/common';
import { ServiceNames } from '@app/common/constants/microservice';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    DynamicConfigModule.register('auth'),
    createMicroserviceClientsConfig(ServiceNames.USER_SERVICE),
    JwtModule.registerAsync({
      imports: [DynamicConfigModule.register('auth')],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getJWTSecret(),
        signOptions: {
          expiresIn: configService.getJWTExpire(),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
