import { HttpException, HttpStatus } from '@nestjs/common';

export class BidTimeoutException extends HttpException {
  constructor() {
    super(
      `The time for bidding is over for this product`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
