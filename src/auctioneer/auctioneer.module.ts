import { Module } from '@nestjs/common';
import { BidModule } from '../bid/bid.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { Auctioneer } from './auctioneer.service';

@Module({
  imports: [ProductModule, BidModule, UserModule],
  providers: [Auctioneer],
})
export class AuctioneerModule {}
