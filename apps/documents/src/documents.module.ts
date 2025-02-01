import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import {
  createMicroserviceClientsConfig,
  DatabaseModule,
  DynamicConfigModule,
  ProvideRepository,
} from '@app/common';
import { DocumentRepository } from './repository/user.repository';
import { Document } from './entities/document.entity';
import { ServiceNames } from '@app/common/constants/microservice';

@Module({
  imports: [
    DynamicConfigModule.register('documents'),
    createMicroserviceClientsConfig(ServiceNames.AUTH_SERVICE),
    DatabaseModule.register('documents', [Document]),
  ],
  controllers: [DocumentsController],
  providers: [
    ProvideRepository(DocumentRepository, Document),
    DocumentsService,
  ],
})
export class DocumentsModule {}
