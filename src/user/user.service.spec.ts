import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { EncryptService } from '../encrypt/encrypt.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { mockUser } from '../utils/mock/user';
import { User } from './entities/user.entity';

const userData = {
  ...mockUser,
};
const updatedUserData = {
  ...mockUser,
  name: 'changed name',
};
const userEntity = new User(userData);
const updatedUserEntity = new User(updatedUserData);

describe('UserService', () => {
  let userService: UserService;
  let encryptService: EncryptService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(userEntity),
            findOneBy: jest.fn().mockResolvedValue(userEntity),
            findOne: jest.fn().mockResolvedValue(userEntity),
            findOneOrFail: jest.fn().mockResolvedValue(userEntity),
            merge: jest.fn().mockResolvedValue(updatedUserEntity),
          },
        },
        {
          provide: EncryptService,
          useValue: {
            encrypHash: jest.fn().mockResolvedValue('hashedPassword'),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    encryptService = module.get<EncryptService>(EncryptService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(encryptService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find user By Email', async () => {
      const result = await userService.findByEmail('exist@email.com');

      expect(result).toEqual(userEntity);
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      const result = await userService.findByEmail('not-exist@email.com');

      expect(result).toEqual(null);
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });
});
