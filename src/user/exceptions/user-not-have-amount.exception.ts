import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotHaveAmountException extends HttpException {
  constructor(amount: number | string) {
    super(
      `the user must have credit greater than ${amount}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
