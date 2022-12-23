import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid])],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
