import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceNames } from '@app/common/constants/microservice';

@Module({})
export class DynamicClientModule {
  static register(
    serviceName: ServiceNames,
    port: number,
    host: string,
  ): DynamicModule {
    return {
      module: DynamicClientModule,
      imports: [
        ClientsModule.registerAsync({
          clients: [
            {
              name: serviceName,
              useFactory: () => ({
                transport: Transport.TCP,
                options: {
                  port,
                  host,
                },
              }),
            },
          ],
        }),
      ],
    };
  }
}
