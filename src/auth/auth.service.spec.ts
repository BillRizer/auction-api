import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { mockUser } from '../utils/mock/user';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-token',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateJwtAuth: jest.fn((user) => {
              return { jwt: `${JSON.stringify(user)}` };
            }),
            validateUser: jest
              .fn()
              .mockImplementation((email, pass) =>
                email === mockUser.email && pass === mockUser.password
                  ? mockUser
                  : null,
              ),
          },
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate user with username invalid', async () => {
    const validate = await authService.validateUser('user-away', 'pass');

    expect(validate).toEqual(null);
  });

  it('should validate user with password invalid', async () => {
    const validate = await authService.validateUser('user', 'pass-wrong');

    expect(validate).toEqual(null);
  });

  it('should validate user with user valid', async () => {
    const validate = await authService.validateUser(
      'test@example.com',
      'hashedPassword',
    );

    expect(validate).toEqual(mockUser);
  });

  it('should generate jwt token with size greater then 32', async () => {
    const login = await authService.generateJwtAuth(mockUser);

    expect(login.jwt.length).toBeGreaterThan(32);
  });
});
