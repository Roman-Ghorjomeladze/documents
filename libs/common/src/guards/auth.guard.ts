import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { getClientName } from '../utils/helpers/client.helper';
import { ServiceNames } from '../constants/microservice';

@Injectable()
export class AuthGuard implements CanActivate {
  whiteListedEndpoints = [];
  constructor(
    @Inject(getClientName(ServiceNames.AUTH_SERVICE))
    private authClient: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (this.isWhiteListedApi(request.route.path)) {
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await firstValueFrom(
        this.authClient.send('auth.validateToken', token),
      );
      request['user'] = payload;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
    return true;
  }

  private isWhiteListedApi(path: string): boolean {
    return this.whiteListedEndpoints.includes(path);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as Headers & { authorization?: string };
    const [type, token] = headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
