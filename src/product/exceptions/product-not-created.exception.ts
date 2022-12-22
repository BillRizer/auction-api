import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotCreatedException extends HttpException {
  constructor() {
    super('Product not created', HttpStatus.BAD_REQUEST);
  }
}
