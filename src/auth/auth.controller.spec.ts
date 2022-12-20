import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateJwtAuth: jest.fn((user) => {
              return { jwt: `${JSON.stringify(user)}` };
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('auth/login', () => {
    it('should prevent jwt undefined value', async () => {
      const user = await authController.login({
        user: { username: 'wrong-user', userId: 1 },
      });

      expect(user).not.toEqual('undefined');
      expect(authService.generateJwtAuth).toBeCalledTimes(1);
    });
  });
});
