import { Injectable } from '@nestjs/common';
import { BidService } from '../bid/bid.service';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class Auctioneer {
  constructor(
    private productService: ProductService,
    private bidService: BidService,
    private userService: UserService,
  ) {
    AuctioneerSingleton.getInstance(productService, bidService, userService);
  }
}

export class AuctioneerSingleton {
  private static instance: AuctioneerSingleton;
  private productService: ProductService;
  private bidService: BidService;
  private userService: UserService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(
    productService: ProductService,
    bidService: BidService,
    userService: UserService,
  ) {
    this.productService = productService;
    this.bidService = bidService;
  }

  public static getInstance(
    productService,
    bidService,
    userService,
  ): AuctioneerSingleton {
    if (!AuctioneerSingleton.instance) {
      AuctioneerSingleton.instance = new AuctioneerSingleton(
        productService,
        bidService,
        userService,
      );
      AuctioneerSingleton.startLoop();
    }

    return AuctioneerSingleton.instance;
  }

  private static startLoop() {
    setInterval(() => {
      AuctioneerSingleton.main();
    }, +process.env.AUCTIONEER_FREQUENCY_INTERVAL_MS || 3000);
  }
  private static async main() {}
}
