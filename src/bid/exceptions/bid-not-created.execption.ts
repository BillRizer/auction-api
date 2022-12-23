import { HttpException, HttpStatus } from '@nestjs/common';

export class BidNotCreatedException extends HttpException {
  constructor() {
    super('Bid not created', HttpStatus.BAD_REQUEST);
  }
}
