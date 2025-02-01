import { DynamicConfigModule } from '@app/common/config/config.module';
import { ConfigService } from '@app/common/config/config.service';
import { ClientNames, ServiceNames } from '@app/common/constants/microservice';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const getClientName = (serviceName: ServiceNames): ClientNames => {
  const map = {
    [ServiceNames.AUTH_SERVICE]: ClientNames.AUTH_CLIENT,
    [ServiceNames.BILLING_SERVICE]: ClientNames.BILLING_CLIENT,
    [ServiceNames.DOCUMENT_SERVICE]: ClientNames.DOCUMENT_CLIENT,
    [ServiceNames.USER_SERVICE]: ClientNames.USER_CLIENT,
  };
  if (!map?.[serviceName]) throw new Error('Unknown service name');
  return map?.[serviceName];
};

export const createMicroserviceClientsConfig = (
  ...serviceNames: ServiceNames[]
) => {
  return ClientsModule.registerAsync({
    clients: serviceNames.map((serviceName) => ({
      imports: [DynamicConfigModule.register('auth')],
      inject: [ConfigService],
      name: getClientName(serviceName),
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: configService.getHost(serviceName),
          port: configService.getMsPort(serviceName),
        },
      }),
    })),
  });
};
