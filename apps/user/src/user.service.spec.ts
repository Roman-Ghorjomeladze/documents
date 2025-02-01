import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { userMock } from '@app/common/testingUtils/mocks/user/userMocks';
import { RegisterDto } from '../../auth/src/dto/register.dto';
import { UserStatuses } from '@app/common/constants/user';

describe('UsersService', () => {
  let usersService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('findOne', () => {
    it('should return a user when found by ID', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);

      const result = await usersService.findOne(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toMatchSnapshot();
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await usersService.findOne(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user without the password field', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword';
      const savedUser: User = userMock;

      const savedUserWithoutPassword = { ...savedUser };
      delete savedUserWithoutPassword.password;

      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPassword);
      jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);

      const result = await usersService.createUser(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userRepository.save).toHaveBeenCalledWith({
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        password: hashedPassword,
        status: UserStatuses.ACTIVE,
      });
      expect(result).toEqual(savedUserWithoutPassword);
    });
  });

  describe('findByEmail', () => {
    it('should return a user with password when selectPassword is true', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);

      const result = await usersService.findByEmail('test@example.com', true);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: ['email', 'password', 'firstName', 'lastName', 'id', 'status'],
      });
      expect(result).toMatchSnapshot();
    });

    it('should return a user without password when selectPassword is false', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userMock);

      const result = await usersService.findByEmail('test@example.com', false);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toMatchSnapshot();
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await usersService.findByEmail('test@example.com', false);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toBeNull();
    });
  });
});
