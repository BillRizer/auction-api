import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptService } from '../encrypt/encrypt.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailAlreadyExistException } from '../common/exceptions/email-already-exists.exception';

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
    if (await this.findByEmail(createUserDto.email)) {
      throw new EmailAlreadyExistException();
    }
    try {
      const hashedPassword = await this.encrypt.encrypHash(
        createUserDto.password,
      );

      const created = await this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(created);
    } catch (error) {
      //TODO log here
      return null;
    }
  }
  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async findOneOrFail(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      throw new NotFoundException('Could not find this user');
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneOrFail(userId);
    if (updateUserDto.old_password?.length > 0) {
      const validPassword = await this.encrypt.compareHash(
        updateUserDto.old_password,
        user.password,
      );
      if (!validPassword) {
        throw new Error('The old password is incorrect');
      }
      updateUserDto.password = await this.encrypt.encrypHash(
        updateUserDto.password,
      );
    }
    try {
      this.userRepository.merge(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      //TODO: add in log
      // error. sqlMessage and error.sql
      if (error.code === 'ER_DUP_ENTRY') {
        throw new NotFoundException('Could not update, this email exists');
      }
      throw new NotFoundException('Could not update');
    }
  }

  async deleteById(id: string) {
    await this.findOneOrFail(id);
    await this.userRepository.softDelete(id);
  }
}
