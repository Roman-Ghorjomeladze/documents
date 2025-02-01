import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';

export class DocumentRepository extends Repository<Document> {}
