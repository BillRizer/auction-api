import { Module } from '@nestjs/common';
import { SaleModule } from '../sale/sale.module';
import { BidModule } from '../bid/bid.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { Auctioneer } from './auctioneer.service';

@Module({
  imports: [ProductModule, BidModule, UserModule, SaleModule],
  providers: [Auctioneer],
  exports: [Auctioneer],
})
export class AuctioneerModule {}
