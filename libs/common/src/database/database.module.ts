import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@app/common/config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicConfigModule } from '@app/common';
import { DBConfig } from '@app/common/database/db';

@Module({})
export class DatabaseModule {
  static register(serviceName: string, entities): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [DynamicConfigModule.register(serviceName)],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            DBConfig(configService, entities),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
