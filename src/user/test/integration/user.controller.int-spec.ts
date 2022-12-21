import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../../../app.module';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { userStub } from '../stubs/user.stub';
import { Repository } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { DatabaseModule } from '../../../database/database.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../../user/user.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { envFilePath } from '../../../utils/helpers';
import { join } from 'path';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let userRepository: Repository<User>;
  let userService: UserService;

  const createdUserStub: CreateUserDto = {
    email: userStub.email,
    name: userStub.name,
    credit: userStub.credit,
    password: userStub.password,
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        DatabaseModule,
        ConfigModule.forRoot({
          envFilePath: [
            join(envFilePath, '.env'),
            join(envFilePath, '.env.test'),
          ],
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    userService = app.get<UserService>(UserService);
  });

  afterAll(async () => {
    await userRepository.clear();
    app.close();
  });

  describe('/user [POST] (integration)', () => {
    it('it should register a user and return the new user object', async () => {
      request(httpServer)
        .post('/user')
        .set('Accept', 'application/json')
        .send(createdUserStub)
        .expect((response: request.Response) => {
          const { id, name, password, email, credit, createdAt, updatedAt } =
            response.body;

          expect(typeof id).toBe('string'),
            expect(password).toBeUndefined(),
            expect(name).toEqual(createdUserStub.name),
            expect(email).toEqual(createdUserStub.email),
            expect(credit).toEqual(0);
        })
        .expect(HttpStatus.CREATED);

      await userRepository.clear();
    });
  });


});

async function getJwtToken(httpServer, email: string, password: string) {
  let jwtToken = '';
  try {
    await request(httpServer)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({ email, password })
      .expect(HttpStatus.OK)
      .then((response) => {
        jwtToken = response.body.jwt;
      });
    return jwtToken;
  } catch (error) {
    return null;
  }
}
