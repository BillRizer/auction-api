import { HttpException, HttpStatus } from '@nestjs/common';

export class AvailableForAuctionAlreadySetted extends HttpException {
  constructor() {
    super('Available for auction already setted', HttpStatus.BAD_REQUEST);
  }
}
