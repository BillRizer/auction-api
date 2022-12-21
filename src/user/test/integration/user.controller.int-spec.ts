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

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let userRepository: Repository<User>;
  const userMocked: CreateUserDto = {
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
            '/media/odin/ssd-data/work/projects/auction-api/auction-api/.env',
            '/media/odin/ssd-data/work/projects/auction-api/auction-api/.env.test',
          ],
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    // await userRepository.clear();
    app.close();
  });

  it('it should register a user and return the new user object', async () => {
    request(httpServer)
      .post('/user')
      .set('Accept', 'application/json')
      .send(userMocked)
      .expect((response: request.Response) => {
        const { id, name, password, email, credit, createdAt, updatedAt } =
          response.body;

        expect(typeof id).toBe('string'),
          expect(password).toBeUndefined(),
          expect(name).toEqual(userMocked.name),
          expect(email).toEqual(userMocked.email),
          expect(credit).toEqual(0);
      })
      .expect(HttpStatus.CREATED);

    await userRepository.clear();
  });


});
