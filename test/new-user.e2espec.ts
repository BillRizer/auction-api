import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AuthController (e2e)', () => {
  const authUrl = `http://localhost:3000/api/v1`;

  const mockUser: CreateUserDto = {
    name: 'My name is dottood',
    email: 'dottood@email.com',
    password: 'dottood',
  };
  let userId = '';
  let UserJWT = '';

  describe('/user (post)', () => {
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
            expect(credit).toEqual(0);
        })
        .expect(HttpStatus.CREATED);
    });

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
        .expect(HttpStatus.CREATED);
    });

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
            expect(credit).toEqual(0);
        })
        .expect(HttpStatus.OK);
    });

    it('it should remove user', () => {
      return request(authUrl)
        .delete('/user')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${UserJWT}`)
        .expect(HttpStatus.OK);
    });
  });
});
