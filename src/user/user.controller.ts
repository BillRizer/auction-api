import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { ResponseProfileUser } from './dto/response-profile-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserNotCreatedException } from './exceptions/user-not-created.exception';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseProfileUser> {
    const userCreated = await this.userService.create({
      ...createUserDto,
      credit: 0,
    });
    if (!userCreated) {
      throw new UserNotCreatedException();
    }
    const { password, deletedAt, ...user } = userCreated;
    return <ResponseProfileUser>{ ...user };
  }

  @Get()
  async getProfile(
    @Request() req: RequestWithUser,
  ): Promise<ResponseProfileUser> {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    try {
      const { password, deletedAt, ...user } = await this.userService.findOne(
        userId,
      );
      return <ResponseProfileUser>{ ...user };
    } catch (error) {
      throw new HttpException(
        'problema ao buscar perfil',
        HttpStatus.BAD_REQUEST,
      );
    }
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
      const { password, deletedAt, ...user } = await this.userService.update(
        userId,
        { ...updateCompanyDto, email: undefined },
      );
      return <ResponseProfileUser>{ ...user };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @HttpCode(200)
  @Delete()
  async delete(@Request() req: RequestWithUser) {
    try {
      const userId = req.user.userId;
      if (!userId) {
        throw new UnauthorizedException();
      }
      await this.userService.deleteById(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
