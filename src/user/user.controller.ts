import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';
import { Public } from '../auth/decorator/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create({ ...createUserDto, credit: 0 });
  }

  @Get()
  async getProfile(@Request() req: RequestWithUser): Promise<User> {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.userService.findOne(userId);
  }

  @Patch()
  async update(
    @Request() req: RequestWithUser,
    @Body() updateCompanyDto: UpdateUserDto,
  ) {
    try {
      const userId = req.user.userId;
      if (!userId) {
        throw new UnauthorizedException();
      }
      return await this.userService.update(userId, updateCompanyDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  delete(@Request() req: RequestWithUser) {
    try {
      const userId = req.user.userId;
      if (!userId) {
        throw new UnauthorizedException();
      }
      return this.userService.deleteById(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
