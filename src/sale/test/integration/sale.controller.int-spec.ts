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
import { Sale } from '../../../sale/entities/sale.entity';
import { createProductStub } from '../../../product/test/stubs/product.stub';
import { CreateSaleDto } from '../../../sale/dto/create-sale.dto';

describe('SaleController (integration)', () => {
  let app: INestApplication;
  let httpServer: any;
  let userService: UserService;
  let productService: ProductService;
  let saleRepository: Repository<Sale>;
  let jwtToken = '';
  let userInfo: any;
  let productFromUser: Product;

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
    saleRepository = app.get<Repository<Sale>>(getRepositoryToken(Sale));
    userService = app.get<UserService>(UserService);
    productService = app.get<ProductService>(ProductService);

    //create user
    await userService.create(createdUserStubA);
    await userService.create(createdUserStubB);

    //TODO refactor this, duplicate code for get jwt token
    jwtToken = await getJwtToken(
      httpServer,
      createdUserStubA.email,
      createdUserStubA.password,
    );

    userInfo = await getUserInfo(httpServer, jwtToken);

    productFromUser = await productService.create({
      ...createProductStub,
      user: { id: userInfo.id },
    });
  });
  afterAll(async () => {
    await app.close();
  });

  it('should have jwt tokens', () => {
    expect(jwtToken).toBeDefined();
  });

  describe('/sale [GET] (integration)', () => {
    // beforeEach(async () => {
    //   await cleanSaleTable(saleRepository);
    // });
    // it('it should get all sales', async () => {
    //   await request(httpServer)
    //     .post(`/sale`)
    //     .set('Accept', 'application/json')
    //     .set({
    //       Authorization: `Bearer ${jwtToken}`,
    //     })
    //     .expect(HttpStatus.OK);
    // });
  });
});

export async function cleanSaleTable(saleRepository) {
  await saleRepository.query(`TRUNCATE "sale" CASCADE;`);
}
