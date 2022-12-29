import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../../../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { envFilePath } from '../../../utils/helpers';
import { join } from 'path';
import { getJwtToken } from '../../../auth/test/integration/auth.controller.int-spec';
import { Product } from '../../../product/entities/product.entity';
import { ProductService } from '../../../product/product.service';
import { UserService } from '../../../user/user.service';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { userStub } from '../../../user/test/stubs/user.stub';

import { getUserInfo } from '../../../user/test/integration/user.controller.int-spec';
import { Bid } from '../../../bid/entities/bid.entity';
import { createProductStub } from '../../../product/test/stubs/product.stub';
import { CreateBidDto } from '../../../bid/dto/create-bid.dto';

describe('BidController (integration)', () => {
  let app: INestApplication;
  let httpServer: any;
  let userService: UserService;
  let productService: ProductService;
  let bidRepository: Repository<Bid>;
  let jwtTokenA = '';
  let jwtTokenB = '';
  let userInfoA: any;
  let userInfoB: any;
  let productFromUserA: Product;

  const createdUserStubA: CreateUserDto = {
    email: userStub.email,
    name: userStub.name,
    credit: userStub.credit,
    password: userStub.password,
  };
  const createdUserStubB: CreateUserDto = {
    email: 'b_' + userStub.email,
    name: 'b_' + userStub.name,
    credit: userStub.credit,
    password: userStub.password,
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,

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
    bidRepository = app.get<Repository<Bid>>(getRepositoryToken(Bid));
    userService = app.get<UserService>(UserService);
    productService = app.get<ProductService>(ProductService);

    //create user
    await userService.create(createdUserStubA);
    await userService.create(createdUserStubB);

    //TODO refactor this, duplicate code for get jwt token
    jwtTokenA = await getJwtToken(
      httpServer,
      createdUserStubA.email,
      createdUserStubA.password,
    );
    jwtTokenB = await getJwtToken(
      httpServer,
      createdUserStubA.email,
      createdUserStubA.password,
    );
    userInfoA = await getUserInfo(httpServer, jwtTokenA);
    userInfoB = await getUserInfo(httpServer, jwtTokenB);

    productFromUserA = await productService.create({
      ...createProductStub,
      user: { id: userInfoA.id },
    });
  });
  afterAll(async () => {
    await app.close();
  });

  it('should have jwt tokens', () => {
    expect(jwtTokenA).toBeDefined();
    expect(jwtTokenB).toBeDefined();
  });

  describe('/bid [POST] (integration)', () => {
    beforeEach(async () => {
      await cleanBidTable(bidRepository);
    });

    it('it should create a bid for product', async () => {
      await request(httpServer)
        .post(`/bid/${productFromUserA.id}`)
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${jwtTokenB}`,
        })
        .send(<CreateBidDto>{ value: 1.99 })
        .expect(HttpStatus.CREATED);
    });

    it('it should throw error when try use same value for a bid', async () => {
      await request(httpServer)
        .post(`/bid/${productFromUserA.id}`)
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${jwtTokenB}`,
        })
        .send(<CreateBidDto>{ value: 1.99 })
        .expect(HttpStatus.CREATED);

      await request(httpServer)
        .post(`/bid/${productFromUserA.id}`)
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${jwtTokenB}`,
        })
        .send(<CreateBidDto>{ value: 1.99 })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});

export async function cleanBidTable(bidRepository) {
  await bidRepository.query(`TRUNCATE "bid" CASCADE;`);
}
