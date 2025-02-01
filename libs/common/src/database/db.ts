import { ConfigService } from '@app/common/config/config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DBConfig = (
  configService: ConfigService,
  entities,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: +configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: entities,
    synchronize: true, // Set to false in production for migrations
  };
};
