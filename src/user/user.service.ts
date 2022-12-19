import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptService } from '../encrypt/encrypt.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      if (await this.findByEmail(createUserDto.email)) {
        throw new Error('Email address already exists.');
      }
      const hashedPassword = await this.encrypt.encrypHash(
        createUserDto.password,
      );

      const created = await this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(created);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
