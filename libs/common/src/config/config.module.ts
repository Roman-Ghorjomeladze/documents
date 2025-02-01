import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { ConfigService } from '@app/common/config/config.service';

@Module({ imports: [ConfigModule], providers: [ConfigService] })
export class DynamicConfigModule {
  static register(serviceName: string): DynamicModule {
    const envFilePath = path.resolve(
      process.cwd(),
      serviceName ? `apps/${serviceName}/.env` : './env',
    );

    return {
      module: DynamicConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [path.resolve(process.cwd(), 'shared.env'), envFilePath],
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
