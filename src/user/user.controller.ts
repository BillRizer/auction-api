import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';
import { Public } from '../auth/decorator/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async getProfile(@Request() req: RequestWithUser): Promise<User> {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.userService.findOne(userId);
  }
}
