import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class AuthService {
  // mocked function should to be removed
  private readonly users = [
    {
      userId: 1,
      username: 'user',
      password: 'pass',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'pass2',
    },
  ];
  // mocked function should to be removed
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}