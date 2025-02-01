import { AuthGuard, whitelistedEndpoints } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@app/common/config/config.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(() => {
    jwtService = createMock<JwtService>();
    configService = createMock<ConfigService>();
    authGuard = new AuthGuard(jwtService, configService);
  });

  const mockExecutionContext = (
    path: string,
    authorization?: string,
  ): ExecutionContext =>
    createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          route: { path },
          headers: authorization ? { authorization } : {},
        }),
      }),
    });

  it('should return true if the endpoint is whitelisted', async () => {
    const context = mockExecutionContext('/api/auth/login');
    const result = await authGuard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const context = mockExecutionContext('/api/protected');
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if the token is invalid', async () => {
    const context = mockExecutionContext(
      '/api/protected',
      'Bearer invalid-token',
    );
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return true and attach user to the request if the token is valid', async () => {
    const userPayload = { id: 1, username: 'testuser' };

    // Create a shared reference for the request object.
    const request = {
      route: { path: '/api/protected' },
      headers: { authorization: 'Bearer valid-token' },
    };

    // Mock the ExecutionContext to return this shared request object.
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    // Mock the JwtService and ConfigService methods.
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(userPayload);
    jest.spyOn(configService, 'get').mockReturnValue('jwt-secret-key');

    // Call canActivate and expect it to return true.
    const result = await authGuard.canActivate(context);
    expect(result).toBe(true);

    // Now, the 'user' key should be attached to the request.
    expect(request['user']).toEqual(userPayload);
  });

  it('should return undefined if authorization header is missing or malformed', () => {
    const requestWithNoAuth = { headers: {} } as any;
    const requestWithInvalidAuth = {
      headers: { authorization: 'InvalidHeader' },
    } as any;

    expect(
      authGuard['extractTokenFromHeader'](requestWithNoAuth),
    ).toBeUndefined();
    expect(
      authGuard['extractTokenFromHeader'](requestWithInvalidAuth),
    ).toBeUndefined();
  });

  it('should correctly identify whitelisted endpoints', () => {
    whitelistedEndpoints.forEach((endpoint) => {
      expect(authGuard['isWhiteListedApi'](endpoint)).toBe(true);
    });

    expect(authGuard['isWhiteListedApi']('/api/protected')).toBe(false);
  });
});
