import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorator/public.decorator';
import { LoggerAdapter } from '../logger/logger';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @HttpCode(200)
  @Public()
  @ApiTags('authentication')
  @ApiOperation({ description: 'Get JWT token using email and password' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  public async login(@Request() req) {
    LoggerAdapter.logRawMessage(
      'activities',
      `authenticated userid=${req.user.id} email=${req.user.email}`,
    );
    return this.authService.generateJwtAuth(req.user);
  }
}
