import { NestFactory } from '@nestjs/core';
import { DocumentsModule } from './documents.module';
import { ConfigService } from '@app/common';
import { ServiceNames } from '@app/common/constants/microservice';

let HTTP_PORT: number;
async function bootstrap() {
  const app = await NestFactory.create(DocumentsModule);
  const configService: ConfigService = app.get(ConfigService);
  HTTP_PORT = configService.getHttpPort(ServiceNames.DOCUMENT_SERVICE);
  await app.listen(HTTP_PORT);
}
bootstrap()
  .then(() => {
    console.log('DOCUMENT module is up and running on port', HTTP_PORT);
  })
  .catch((err) => {
    console.error('Failed to start DOCUMENT module', err);
  });
