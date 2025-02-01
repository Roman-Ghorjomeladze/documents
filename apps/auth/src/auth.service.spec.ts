import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailIsTakenError } from '../users/errors/EmailIsTaken.error';
import { UserNotFoundByCredentialsError } from './errors/userNotFound.error';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestUser } from '../../interfaces/http';
import { userMock } from '../../../common/testingUtils/mocks/user/userMocks';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw EmailIsTakenError if email is already taken', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(userMock);

      await expect(authService.register(registerDto)).rejects.toThrow(
        EmailIsTakenError,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
    });

    it('should create a new user if email is not taken', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'createUser').mockResolvedValue(userMock);

      const result = await authService.register(registerDto);
      expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userService.createUser).toHaveBeenCalledWith(registerDto);
      expect(result).toMatchSnapshot();
    });
  });

  describe('login', () => {
    it('should throw UserNotFoundByCredentialsError if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UserNotFoundByCredentialsError,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(
        loginDto.email,
        true,
      );
    });

    it('should throw UserNotFoundByCredentialsError if passwords do not match', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(userMock);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UserNotFoundByCredentialsError,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        userMock.password,
      );
    });

    it('should return user and token if login is successful', async () => {
      const loginDto: LoginDto = {
        email: userMock.email,
        password: userMock.password,
      };
      const mockToken = 'jwt-token';

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(userMock);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.login(loginDto);
      expect(userService.findByEmail).toHaveBeenCalledWith(
        loginDto.email,
        true,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        userMock.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: userMock.id,
        email: userMock.email,
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('me', () => {
    it('should return user information', async () => {
      const mockUser: RequestUser = { id: userMock.id, email: userMock.email };

      jest.spyOn(userService, 'findOne').mockResolvedValue(userMock);

      const result = await authService.me(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(result).toMatchSnapshot();
    });
  });
});
