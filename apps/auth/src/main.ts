import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@app/common/config/config.service';
import { ServiceNames } from '@app/common/constants/microservice';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

let HTTP_PORT: number;

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const jwtService = app.get<JwtService>(JwtService);
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalGuards(new AuthGuard(jwtService, configService));
  app.useGlobalPipes(new ValidationPipe());

  HTTP_PORT = configService.getHttpPort(ServiceNames.AUTH_SERVICE);
  await app.listen(HTTP_PORT, () => {});
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
      transport: Transport.TCP,
      options: {
        host: configService.getHost(ServiceNames.AUTH_SERVICE),
        port: configService.getMsPort(ServiceNames.AUTH_SERVICE), // This is the TCP microservice port
      },
    });
  await microservice.listen();
}
bootstrap()
  .then(() => {
    console.log('AUTH module is up and running on port', HTTP_PORT);
  })
  .catch((err) => {
    console.error('Failed to start Auth module', err);
  });
