import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from '../src/database/database.module';
import { AuthModule } from '../src/auth/auth.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../src/auth/guard/jwt-auth.guard';
import { UserModule } from '../src/user/user.module';
import { ProductModule } from '../src/product/product.module';
import { BidModule } from '../src/bid/bid.module';
import { AuctioneerModule } from '../src/auctioneer/auctioneer.module';
import { LoggerMiddleware } from '../src/common/middlewares/logger.middleware';

//TODO: after remove this please, its works but not a good idea
// when run Auctioneer module in tests, show many errors with database connection

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
