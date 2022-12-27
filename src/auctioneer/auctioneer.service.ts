import { Injectable } from '@nestjs/common';
import { BidService } from '../bid/bid.service';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { UserNotHaveAmountException } from '../user/exceptions/user-not-have-amount.exception';

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
    this.userService = userService;
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
  private static async main() {
    const products =
      await this.instance.productService.findAllAvailableForAuctionEnded();
    if (products.length === 0) {
      // console.log('dont have products');
      return;
    }

    for (const product of products) {
      // console.log('>', product.name);
      const bids = await this.instance.bidService.findAllByProductId(
        product.id,
      );
      if (bids.length == 0) {
        await this.instance.productService.update(product.id, {
          availableForAuction: false,
        });
        // console.log('dont have bids', product.id);
        continue;
      }

      const usersNotEnoughCreditList = [];
      for (const bid of bids) {
        const userIdSend = bid.userId;
        const userIdReceive = product.user.id;
        const money = bid.value;

        if (usersNotEnoughCreditList.includes(userIdSend)) {
          // console.log(
          //   'user exist in blacklist (not enough credit)',
          //   userIdSend,
          // );
          continue;
        }
        try {
          const transfered = await this.instance.userService.transactionCredit(
            userIdSend,
            userIdReceive,
            money,
          );
          if (transfered) {
            await this.instance.productService.update(product.id, {
              availableForAuction: false,
              sold: true,
            });
            break;
          }
        } catch (error) {
          if (error instanceof UserNotHaveAmountException) {
            usersNotEnoughCreditList.push(userIdSend);
          }

          // console.log(error);
        }
      }
    }

    //check if buyer have credit
    //transfer credit to owner
    //not have credit
    //seach next in search list
  }
}
