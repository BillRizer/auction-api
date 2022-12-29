import { Controller, Get } from '@nestjs/common';

import { SaleService } from './sale.service';

import { ApiTags } from '@nestjs/swagger';
import { ResponseSaleDto } from './dto/response-sale';

@ApiTags('Sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async findAll() {
    const sales = await this.saleService.findAll();
    return <Array<ResponseSaleDto>>sales;
  }
}
