import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import {
  ClientProxy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { AuthGuard, ConfigService, getClientName } from '@app/common';
import { ServiceNames } from '@app/common/constants/microservice';

let HTTP_PORT: number;

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const configService: ConfigService = app.get(ConfigService);
  const authClient = app.get<ClientProxy>(
    getClientName(ServiceNames.AUTH_SERVICE),
  );
  HTTP_PORT = configService.getHttpPort(ServiceNames.USER_SERVICE);
  app.useGlobalGuards(new AuthGuard(authClient));

  await app.listen(HTTP_PORT, () => {});

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
      transport: Transport.TCP,
      options: {
        host: configService.getHost(ServiceNames.USER_SERVICE),
        port: configService.getMsPort(ServiceNames.USER_SERVICE),
      },
    });
  await microservice.listen();
}
bootstrap()
  .then(() => {
    console.info('User module is up and running on port', HTTP_PORT);
  })
  .catch((err) => {
    console.error('Failed to start User module', err);
  });
