import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../../../app.module';
import { Repository } from 'typeorm';
import { DatabaseModule } from '../../../database/database.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { envFilePath } from '../../../utils/helpers';
import { join } from 'path';
import { getJwtToken } from '../../../auth/test/integration/auth.controller.int-spec';
import { Product } from '../../../product/entities/product.entity';
import { ProductService } from '../../../product/product.service';
import { UserService } from '../../../user/user.service';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { userStub } from '../../../user/test/stubs/user.stub';
import {
  createProductStub,
  responseCreatedProduct,
} from '../stubs/product.stub';

describe('ProductController (integration)', () => {
  let app: INestApplication;
  let httpServer: any;
  let productRepository: Repository<Product>;
  let productService: ProductService;
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
    productRepository = app.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productService = app.get<ProductService>(ProductService);
    userService = app.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(productRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('/product [POST] (integration)', () => {
    let jwtToken = '';
    beforeAll(async () => {
      await userService.create(createdUserStub);
      //TODO refactor this, duplicate code for get jwt token
      jwtToken = await getJwtToken(
        httpServer,
        createdUserStub.email,
        createdUserStub.password,
      );
    });
    beforeEach(async () => {
      await cleanProductTable(productRepository);
    });

    it('it should create a product and return object', async () => {
      await request(httpServer)
        .post('/product')
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${jwtToken}`,
        })
        .send(createProductStub)
        .expect((response: request.Response) => {
          const { availableForAuction, category, description, name, sold } =
            response.body;

          expect(availableForAuction).toEqual(
            responseCreatedProduct.availableForAuction,
          );
          expect(category).toEqual(responseCreatedProduct.category);
          expect(description).toEqual(responseCreatedProduct.description);
          expect(name).toEqual(responseCreatedProduct.name);
          expect(sold).toEqual(responseCreatedProduct.sold);
        })
        .expect(HttpStatus.CREATED);
    });
    it('it should throw Unauthorized error when using wrong jwt', async () => {
      const fakejwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZWM4OTc2MC0xOWI3LTQ0YzktOTg1OC1kMTFmMDlmNWViYTAiLCJpYXQiOjE2NzE3MzA1NDksImV4cCI6MTY3MTczNDE0OX0.GVkzILlDMgEGpHrNRDEWYhcPCLz70Rk_ws-0HyfoaNY';
      await request(httpServer)
        .post('/product')
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${fakejwt}`,
        })
        .send(createProductStub)
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('it should prevent product with override in user id', async () => {
      const newProduct = {
        ...createProductStub,
        user: { id: 'uuid-try-change' },
      };
      await request(httpServer)
        .post('/product')
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${jwtToken}`,
        })
        .send({ ...newProduct })
        .expect((response: request.Response) => {
          expect(response.body.user_id).not.toEqual('uuid-try-change');
        })
        .expect(HttpStatus.CREATED);
    });
  });
});

export async function cleanProductTable(productRepository) {
  await productRepository.query(`TRUNCATE "product" CASCADE;`);
}
