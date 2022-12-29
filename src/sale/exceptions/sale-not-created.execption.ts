import { HttpException, HttpStatus } from '@nestjs/common';

export class SaleNotCreatedException extends HttpException {
  constructor() {
    super('Sale not created', HttpStatus.BAD_REQUEST);
  }
}
