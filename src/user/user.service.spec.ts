import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { EncryptService } from '../encrypt/encrypt.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { mockUser } from '../utils/mock/user';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

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
            softDelete: jest.fn().mockResolvedValue(undefined),
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

  describe('create', () => {
    it('should create user', async () => {
      const newUser: CreateUserDto = {
        ...userData,
        email: 'new-email@email.com',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null);
      const created = await userService.create(newUser);

      expect(created).toEqual(userEntity);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(encryptService.encrypHash).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find user', async () => {
      const result = await userService.findOne('uuid-fake');

      expect(result).toEqual(userEntity);
    });

    it('should return null when not found user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      const result = await userService.findOne('uuid-fake');

      expect(result).toEqual(null);
    });
  });

  describe('Update', () => {
    it('should update user', async () => {
      const updateData: UpdateUserDto = {
        ...updatedUserData,
      };

      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce(updatedUserEntity);
      const updated = await userService.update('fake-uuid', updateData);

      expect(updated).toEqual(updateData);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      expect(
        userService.update('fake-uuid', UpdateUserDto),
      ).rejects.toThrowError();
    });
  });

  describe('Delete', () => {
    it('should delete user', async () => {
      const deleted = await userService.deleteById('fake-uuid');

      expect(deleted).toBeUndefined();
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(userRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception when not found', async () => {
      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(userService.deleteById('fake-uuid')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw an exception', async () => {
      jest
        .spyOn(userRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      expect(userService.deleteById('fake-uuid')).rejects.toThrowError();
    });
  });
});
