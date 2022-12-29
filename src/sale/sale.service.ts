import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerAdapter } from '../logger/logger';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { SaleNotCreatedException } from './exceptions/sale-not-created.execption';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
  ) {}
  async create(
    userId: string,
    productId: string,
    createSaleDto: CreateSaleDto,
  ) {
    try {
      const created = await this.saleRepository.create({
        ...createSaleDto,
        userId,
        productId,
      });
      return await this.saleRepository.save(created);
    } catch (error) {
      LoggerAdapter.logRawMessage(
        'error',
        'bif.service error=' + JSON.stringify(error),
      );
      throw new SaleNotCreatedException();
    }
  }

  async findAll() {
    return await this.saleRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
