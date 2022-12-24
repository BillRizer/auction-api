import { HttpException, HttpStatus } from '@nestjs/common';

export class BidLowerException extends HttpException {
  constructor(bidValue?: number) {
    super(
      `Lower bid than current.${
        bidValue ? ' The value must be greater than ' + bidValue : ''
      }`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
