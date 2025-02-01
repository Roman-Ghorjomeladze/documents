import { Controller, Get, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@app/common';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('/hello')
  getHello(): string {
    return this.documentsService.getHello();
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getDocs() {
    return await this.documentsService.getDocuments();
  }
}
