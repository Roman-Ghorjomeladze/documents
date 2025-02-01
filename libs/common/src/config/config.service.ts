import { ConfigService as NestConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { ServiceNames } from '@app/common/constants/microservice';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService extends NestConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    super();
    dotenv.config(); // Load environment variables from env file
    this.envConfig = process.env;
  }

  getMsPort(serviceName: ServiceNames): number {
    const key = `${serviceName}_MS_PORT`;
    return +this.envConfig[key];
  }

  getHttpPort(serviceName: ServiceNames): number {
    const key = `${serviceName}_HTTP_PORT`;
    return Number(this.envConfig[key]);
  }

  getHost(serviceName: ServiceNames): string {
    const key = `${serviceName}_HOST`;
    return this.envConfig[key];
  }

  getJWTSecret(): string {
    return this.get('JWT_SECRET');
  }

  getJWTExpire(): string {
    return this.get('JWT_EXPIRES_IN');
  }
}
