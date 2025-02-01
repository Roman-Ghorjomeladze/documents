import { Injectable } from '@nestjs/common';
import { DocumentRepository } from './repository/user.repository';

@Injectable()
export class DocumentsService {
  constructor(private documentRepository: DocumentRepository) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getDocuments() {
    return await this.documentRepository.find();
  }
}
