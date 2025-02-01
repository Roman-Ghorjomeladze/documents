import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@app/common/config/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
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
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private isWhiteListedApi(path: string): boolean {
    return whitelistedEndpoints.includes(path);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as Headers & { authorization?: string };
    const [type, token] = headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export const whitelistedEndpoints: string[] = [
  '/auth/register',
  '/auth/login',
  '/',
  '',
];
