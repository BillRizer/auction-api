import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([Sale, Product])],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
