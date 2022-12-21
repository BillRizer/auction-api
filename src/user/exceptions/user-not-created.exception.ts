import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotCreatedException extends HttpException {
  constructor() {
    super('User not created', HttpStatus.BAD_REQUEST);
  }
}
