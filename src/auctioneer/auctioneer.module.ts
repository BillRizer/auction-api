import { Module } from '@nestjs/common';
import { BidModule } from 'src/bid/bid.module';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { Auctioneer } from './auctioneer.service';

@Module({
  imports: [ProductModule, BidModule, UserModule],
  providers: [Auctioneer],
})
export class AuctioneerModule {}
