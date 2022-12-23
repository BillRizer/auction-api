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
  productEntityStub,
  requestUpdateProductStub,
} from '../stubs/product.stub';
import { getUserInfo } from '../../../user/test/integration/user.controller.int-spec';
import { RequestUpdateProductDto } from 'src/product/dto/request-update-product.dto';

describe('ProductController (integration)', () => {
  let app: INestApplication;
  let httpServer: any;
  let productRepository: Repository<Product>;
  let productService: ProductService;
  let userService: UserService;
  let jwtToken = '';
  let currentUser: { id: string };

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

    //get jwt token
    await userService.create(createdUserStub);
    //TODO refactor this, duplicate code for get jwt token
    jwtToken = await getJwtToken(
      httpServer,
      createdUserStub.email,
      createdUserStub.password,
    );
    currentUser = await getUserInfo(httpServer, jwtToken);
  });
  it('should be defined', () => {
    expect(productRepository).toBeDefined();
    expect(productService).toBeDefined();
  });
  it('should have jwt token', () => {
    expect(jwtToken).toBeDefined();
  });

  describe('/product [POST] (integration)', () => {
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

  describe('/product [GET] (integration)', () => {
    beforeEach(async () => {
      await cleanProductTable(productRepository);
    });
    it('should get all products by user', async () => {
      const product = {
        ...createProductStub,
        user: { id: currentUser.id },
      };
      await productService.create(product);
      await productService.create(product);
      await productService.create(product);

      await request(httpServer)
        .get('/product')
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${jwtToken}`,
        })
        .expect((response: request.Response) => {
          expect(response.body.length).toEqual(3);
        })
        .expect(HttpStatus.OK);
    });
    it('should get empty array products by user', async () => {
      await request(httpServer)
        .get('/product')
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${jwtToken}`,
        })
        .expect((response: request.Response) => {
          expect(response.body.length).toEqual(0);
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('/product/:id [PATCH] (integration)', () => {
    beforeEach(async () => {
      await cleanProductTable(productRepository);
    });
    it('should update product', async () => {
      const productCreated = await productService.create({
        ...createProductStub,
        user: { id: currentUser.id },
      });

      const update: RequestUpdateProductDto = {
        name: 'changed-name',
        category: 'miscelaneous',
        description: 'my neww description',
        availableForAuction: true,
        sold: true,
      };
      await request(httpServer)
        .patch(`/product/${productCreated.id}`)
        .set('Accept', 'application/json')
        .set({
          Authorization: `Bearer ${jwtToken}`,
        })
        .send(update)
        .expect((response: request.Response) => {
          const { availableForAuction, category, description, name, sold } =
            response.body;

          expect(availableForAuction).toEqual(update.availableForAuction);
          expect(category).toEqual(update.category);
          expect(description).toEqual(update.description);
          expect(name).toEqual(update.name);
          expect(sold).toEqual(update.sold);
        })
        .expect(HttpStatus.OK);
    });
  });
});

export async function cleanProductTable(productRepository) {
  await productRepository.query(`TRUNCATE "product" CASCADE;`);
}
