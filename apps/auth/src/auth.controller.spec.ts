import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HttpStatus } from '@nestjs/common';
import { userMock } from '@app/common/testingUtils/mocks/user/userMocks';
import * as errorHandling from '@app/common/errors/handler';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockResponse: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            me: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('POST /register', () => {
    it('should register a new user and return 201 status', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(userMock);
      jest.spyOn(errorHandling, 'handleError');

      await authController.register(registerDto, mockResponse);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(userMock);
    });

    it('should handle errors during registration', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const error = new Error('Registration failed');

      jest.spyOn(authService, 'register').mockRejectedValue(error);
      jest.spyOn(errorHandling, 'handleError');

      await authController.register(registerDto, mockResponse);

      expect(errorHandling.handleError).toHaveBeenCalledWith(
        mockResponse,
        error,
      );
    });
  });

  describe('POST /login', () => {
    it('should log in the user and return 200 status', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockLoginInfo = { token: 'jwt-token', user: userMock };

      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginInfo);

      await authController.findAll(loginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoginInfo);
    });

    it('should handle errors during login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const error = new Error('Login failed');

      jest.spyOn(authService, 'login').mockRejectedValue(error);
      jest.spyOn(errorHandling, 'handleError');

      await authController.findAll(loginDto, mockResponse);

      expect(errorHandling.handleError).toHaveBeenCalledWith(
        mockResponse,
        error,
      );
    });
  });

  describe('GET /me', () => {
    it('should return the authenticated user info', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const req = { user: mockUser } as any;
      const mockAuthInfo = userMock;

      jest.spyOn(authService, 'me').mockResolvedValue(mockAuthInfo);

      await authController.findOne(req, mockResponse);

      expect(authService.me).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAuthInfo);
    });

    it('should handle errors when fetching authenticated user info', async () => {
      const req = { user: { id: 1, email: 'test@example.com' } } as any;
      const error = new Error('Failed to retrieve user info');

      jest.spyOn(authService, 'me').mockRejectedValue(error);
      jest.spyOn(errorHandling, 'handleError');

      await authController.findOne(req, mockResponse);

      expect(errorHandling.handleError).toHaveBeenCalledWith(
        mockResponse,
        error,
      );
    });
  });
});
