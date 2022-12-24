import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([Bid, Product])],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
