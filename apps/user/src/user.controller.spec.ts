import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '././user.controller';
import { UserService } from './user.service';
import { userMock } from '../../common/testingUtils/mocks/user/userMocks';

describe('UsersController', () => {
  let controller: UserController;
  let usersService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    usersService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET users/{id}', () => {
    it('should return user', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(userMock);
      const result = await controller.findOne('1');
      expect(result).toMatchSnapshot();
    });
  });
});
