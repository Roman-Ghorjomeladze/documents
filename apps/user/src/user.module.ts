import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { ServiceNames } from '@app/common/constants/microservice';
import {
  DynamicConfigModule,
  createMicroserviceClientsConfig,
  DatabaseModule,
  AuthGuard,
} from '@app/common';

@Module({
  controllers: [UserController],
  imports: [
    DynamicConfigModule.register('user'),
    createMicroserviceClientsConfig(ServiceNames.AUTH_SERVICE),
    DatabaseModule.register('user', [User]),
  ],
  providers: [
    AuthGuard,
    UserService,
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(User).extend(UserRepository),
      inject: [DataSource],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
