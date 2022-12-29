import { Injectable } from '@nestjs/common';
import { BidService } from '../bid/bid.service';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { UserNotHaveAmountException } from '../user/exceptions/user-not-have-amount.exception';
import { LoggerAdapter } from '../logger/logger';
import { SaleService } from '../sale/sale.service';
import { Bid } from '../bid/entities/bid.entity';

@Injectable()
export class Auctioneer {
  constructor(
    private productService: ProductService,
    private bidService: BidService,
    private userService: UserService,
    private saleService: SaleService,
  ) {
    AuctioneerSingleton.getInstance(
      productService,
      bidService,
      userService,
      saleService,
    );
    // console.log('auctioneer initialized');
  }
  onModuleDestroy() {
    AuctioneerSingleton.destroy();
  }
}

export class AuctioneerSingleton {
  private static instance: AuctioneerSingleton;
  private static productService: ProductService;
  private static bidService: BidService;
  private static userService: UserService;
  private static saleService: SaleService;
  private static loop;

  private constructor(
    productService: ProductService,
    bidService: BidService,
    userService: UserService,
    saleService: SaleService,
  ) {
    AuctioneerSingleton.productService = productService;
    AuctioneerSingleton.bidService = bidService;
    AuctioneerSingleton.userService = userService;
    AuctioneerSingleton.saleService = saleService;
  }

  public static getInstance(
    productService,
    bidService,
    userService,
    saleService,
  ): AuctioneerSingleton {
    if (!AuctioneerSingleton.instance) {
      AuctioneerSingleton.instance = new AuctioneerSingleton(
        productService,
        bidService,
        userService,
        saleService,
      );
      AuctioneerSingleton.startLoop();
    }

    return AuctioneerSingleton.instance;
  }
  public static destroy(): void {
    if (AuctioneerSingleton.loop) {
      clearInterval(AuctioneerSingleton.loop);
      AuctioneerSingleton.loop = null;
      // console.log('auctioneer destroyed', AuctioneerSingleton.loop);
    }
  }
  private static startLoop() {
    AuctioneerSingleton.loop = setInterval(() => {
      AuctioneerSingleton.main();
    }, +process.env.AUCTIONEER_FREQUENCY_INTERVAL_MS || 3000);
  }
  private static async main() {
    console.log('processing auctioneer');

    const products =
      await this.productService.findAllAvailableForAuctionEnded();
    if (products.length === 0) {
      LoggerAdapter.logRawMessage(
        'debug',
        `AuctionnerService - Don't have products ended`,
      );
      return;
    }
    this.checkProducts(products);
  }

  private static async checkProducts(products: Array<Product>) {
    for (const product of products) {
      LoggerAdapter.logRawMessage(
        'debug',
        `AuctionnerService -  processing product ${product.name}`,
      );
      const bids = await this.bidService.findAllByProductId(product.id);
      if (bids.length == 0) {
        await this.productService.update(product.id, {
          availableForAuction: false,
        });
        LoggerAdapter.logRawMessage(
          'log',
          `AuctionnerService - don't have bids productId=${product.id}`,
        );
        continue;
      }
      await this.checkBids(bids, product);
    }
  }
  private static async checkBids(bids: Array<Bid>, product: Product) {
    for (const bid of bids) {
      const userIdSend = bid.userId;
      const userIdReceive = product.user.id;
      const money = bid.value;

      try {
        const transfered = await this.userService.transactionCredit(
          userIdSend,
          userIdReceive,
          money,
        );
        if (transfered) {
          await this.productService.update(product.id, {
            availableForAuction: false,
            sold: true,
          });
          await this.saleService.create(userIdSend, product.id, {
            value: money,
          });
          LoggerAdapter.logRawMessage(
            'log',
            `AuctionnerService - product ${product.name}[${product.id}] sold from ${userIdReceive} to ${userIdSend}`,
          );
          return;
        }
      } catch (error) {
        LoggerAdapter.logRawMessage(
          'log',
          `AuctionnerService - ${JSON.stringify(error)}`,
        );
      }
    }
    this.rejectAuctionForProduct(product.id);
    LoggerAdapter.logRawMessage(
      'log',
      `AuctionnerService - finished because not have a winner productId=${product.id} productName=${product.name}`,
    );
  }
  private static async rejectAuctionForProduct(productId: string) {
    await this.productService.update(productId, {
      availableForAuction: false,
      sold: false,
    });
  }
}
