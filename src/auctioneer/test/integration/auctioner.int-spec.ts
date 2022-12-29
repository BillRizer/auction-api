import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../../../app.module';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { DatabaseModule } from '../../../database/database.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../../../user/user.service';
import { UpdateUserDto } from '../../../user/dto/update-user.dto';
import { envFilePath } from '../../../utils/helpers';
import { join } from 'path';
import { userStub } from '../../../user/test/stubs/user.stub';
import { cleanUserTable } from '../../../user/test/integration/user.controller.int-spec';

describe('Auctioneer (integration)', () => {
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
    await cleanUserTable(userRepository);
    app.close();
  });

  describe('Auctioneer (integration)', () => {
    it.todo('should ');
  });
});
