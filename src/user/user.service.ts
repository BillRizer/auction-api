import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptService } from '../encrypt/encrypt.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private encrypt: EncryptService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (user) {
      return user;
    }
    return null;
  }
}
