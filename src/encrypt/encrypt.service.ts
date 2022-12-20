import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  constructor(private readonly configService: ConfigService) {}

  public async encrypHash(payload: string): Promise<string> {
    return await bcrypt.hash(payload, +this.configService.get('BCRYPT_SALT'));
  }

  public async compareHash(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  public rand(size: number): string {
    let r;
    let a;
    for (a = ''; (r = Math.random() * 42), a.length < size; )
      a += r < 10 || r > 16 ? String.fromCharCode((48 + r) | 0) : '';
    return a;
  }
}
