import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = {
    userId: 1,
    username: 'user',
    password: 'pass',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    service.findOne = (user) => {
      return new Promise<any>((resolve, reject) =>
        user === mockUser.username ? resolve(mockUser) : resolve(undefined),
      );
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with username invalid', async () => {
    const validate = await service.validateUser('user-away', 'pass');

    expect(validate).toEqual(null);
  });

  it('should validate user with password invalid', async () => {
    const validate = await service.validateUser('user', 'pass-wrong');

    expect(validate).toEqual(null);
  });

  it('should validate user with user valid', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...epectedDataUser } = mockUser;
    const validate = await service.validateUser('user', 'pass');

    expect(validate).toEqual(epectedDataUser);
  });
});