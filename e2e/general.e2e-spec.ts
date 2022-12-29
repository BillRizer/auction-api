import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RequestCreateProductDto } from 'src/product/dto/request-create-product';
import { ResponseBidDto } from '../src/bid/dto/response-bid';

describe('AuthController (e2e)', () => {
  const authUrl = `http://localhost:3000/api/v1`;

  const mockUser: CreateUserDto = {
    name: 'My name is e2e',
    email: `user_e2e_${+new Date()}@email.com`,
    password: 'dottood',
  };
  const mockProduct: RequestCreateProductDto = {
    name: 'my product',
    description: 'my description',
    category: 'rare',
  };
  let userId = '';
  let productId = '';
  let UserJWT = '';

  describe('[POST] /user', () => {
    it('it should register a user and return the new user object', () => {
      return request(authUrl)
        .post('/user')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect((response: request.Response) => {
          const { id, name, password, email, credit, createdAt, updatedAt } =
            response.body;
          userId = id;

          expect(typeof id).toBe('string'),
            expect(password).toBeUndefined(),
            expect(name).toEqual(mockUser.name),
            expect(email).toEqual(mockUser.email),
            expect(credit).toEqual('0.00');
        })
        .expect(HttpStatus.CREATED);
    });
  });
  describe('[POST] /auth/login', () => {
    it('it should be auth and adquire jwt token', () => {
      return request(authUrl)
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({ email: mockUser.email, password: mockUser.password })
        .expect((response: request.Response) => {
          const { jwt } = response.body;
          UserJWT = jwt;

          expect(typeof jwt).toBe('string');
        })
        .expect(HttpStatus.OK);
    });
  });
  describe('[GET] /user ', () => {
    it('it should get profile informations about user', () => {
      return request(authUrl)
        .get('/user')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .expect((response: request.Response) => {
          const { id, name, password, email, credit, createdAt, updatedAt } =
            response.body;

          expect(typeof id).toBe('string'),
            expect(password).toBeUndefined(),
            expect(id).toEqual(userId),
            expect(name).toEqual(mockUser.name),
            expect(email).toEqual(mockUser.email),
            expect(credit).toEqual('0.00');
        })
        .expect(HttpStatus.OK);
    });
  });
  describe('[POST] /product', () => {
    it('should create a new product', () => {
      return request(authUrl)
        .post('/product')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .send(mockProduct)
        .expect((response: request.Response) => {
          const {
            id,
            name,
            description,
            category,
            availableForAuction,
            endsAt,
            sold,
            user_id,
          } = response.body;
          productId = id;
          expect(typeof id).toBe('string'),
            expect(name).toBe(mockProduct.name),
            expect(description).toBe(mockProduct.description),
            expect(category).toBe(mockProduct.category),
            expect(availableForAuction).toBe(false),
            expect(endsAt).toBe(null),
            expect(sold).toBe(false),
            expect(user_id).toBe(userId);
        })
        .expect(HttpStatus.CREATED);
    });
  });
  describe('[GET] /product/available-for-auction/:id ', () => {
    it('should set new product for available in auction', () => {
      return request(authUrl)
        .get(`/product/available-for-auction/${productId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .expect(HttpStatus.OK);
    });
  });
  describe('[GET] /product/available-for-auction ', () => {
    it('should setted product need exists in list ', () => {
      return request(authUrl)
        .get(`/product/available-for-auction`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .expect((response: request.Response) => {
          const ids = response.body.map((item) => item.id);
          expect(ids).toContain(productId);
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('[POST] /bid ', () => {
    it('should create bid for product ', () => {
      return request(authUrl)
        .post(`/bid/${productId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .send(<ResponseBidDto>{ value: 1.97 })
        .expect(HttpStatus.CREATED);
    });
    it('should create more one bid in the product', () => {
      return request(authUrl)
        .post(`/bid/${productId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .send(<ResponseBidDto>{ value: 1.99 })
        .expect(HttpStatus.CREATED);
    });
  });
  describe('[GET] /bid ', () => {
    it('should have bids for product in bids list', () => {
      return request(authUrl)
        .get(`/bid/${productId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .expect((response: request.Response) => {
          const values = response.body.map((item) => item.value);
          expect(values).toContain('1.97');
          expect(values).toContain('1.99');
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('[DELETE] /user', () => {
    it('it should remove user', () => {
      return request(authUrl)
        .delete('/user')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .expect(HttpStatus.OK);
    });
  });
});
