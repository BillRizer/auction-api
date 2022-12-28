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

import { getUserInfo } from '../../../user/test/integration/user.controller.int-spec';
import { BidService } from '../../bid.service';
import { Bid } from '../../entities/bid.entity';

describe('BidController (integration)', () => {
   it.todo('should ');
});

export async function cleanBidTable(bidRepository) {
  await bidRepository.query(`TRUNCATE "bid" CASCADE;`);
}
