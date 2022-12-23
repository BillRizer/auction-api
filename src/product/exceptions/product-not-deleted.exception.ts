import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotDeletedException extends HttpException {
  constructor() {
    super('Product not deleted', HttpStatus.BAD_REQUEST);
  }
}
