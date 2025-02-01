import { DocumentRepository } from '../../../../apps/documents/src/repository/user.repository';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

export const ProvideRepository = (
  //TODO replace any with generic type or something
  repository: any,
  entity: EntityTarget<ObjectLiteral>,
) => {
  return {
    provide: repository,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(entity).extend(DocumentRepository),
    inject: [DataSource],
  };
};
