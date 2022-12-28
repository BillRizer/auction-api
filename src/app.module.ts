import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { BidModule } from './bid/bid.module';
import { AuctioneerModule } from './auctioneer/auctioneer.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProductModule,
    BidModule,
    AuctioneerModule,
    SaleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
