import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { EncryptService } from '../encrypt/encrypt.service';
import { IJwtBody, IJwtResponse } from './interface/jwt-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly encrypt: EncryptService,
  ) {}

  async validateUser(
    email: string,
    plainTextPass: string,
  ): Promise<User | null> {
    const user: User = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await this.verifyPassword(
      plainTextPass,
      user.password,
    );
    if (isPasswordValid === false) {
      return null;
    }
    return user;
  }

  async generateJwtAuth(user: User): Promise<IJwtResponse> {
    const payload: IJwtBody = { userId: user.id };
    return {
      jwt: this.jwtService.sign(payload),
    };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await this.encrypt.compareHash(plainTextPassword, hashedPassword);
  }
}
