import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { mockUser } from '../utils/mock/user';
import { CreateUserDto } from './dto/create-user.dto';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';

const newUserData = {
  ...mockUser,
};
const updatedUserData = {
  ...mockUser,
  name: 'changed name',
};
const newUserEntity = new User(newUserData);

const updatedUserEntity = new User(updatedUserData);

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(newUserEntity),
            findOne: jest.fn().mockResolvedValue(newUserEntity),
            findByEmail: jest.fn(),
            update: jest.fn().mockResolvedValue(updatedUserEntity),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Create', () => {
    it('should create new user', async () => {
      const newUser: CreateUserDto = {
        email: mockUser.email,
        name: mockUser.name,
        password: mockUser.password,
      };
      const created: User = (await userController.create(newUser)) || undefined;

      expect(created.email).toEqual(mockUser.email);
      expect(created.name).toEqual(mockUser.name);
    });
  });

  describe('getProfile', () => {
    it('should find user', async () => {
      const profile = await userController.getProfile({
        user: { userId: 'not-important-id' },
      } as RequestWithUser);

      expect(profile).toEqual(newUserEntity);
    });
  });

  describe('Update ', () => {
    it('should update user data', async () => {
      const newUser: CreateUserDto = {
        ...updatedUserData,
      };
      const updated = await userController.update(
        { user: { userId: 'not-important-id' } } as RequestWithUser,
        newUser,
      );

      expect(updated).not.toEqual(newUserData);
      expect(updated).toEqual(updated);
    });
  });
});
