import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorator/public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Public()
  @ApiTags('authentication')
  @ApiOperation({ description: 'Get JWT token using email and password' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  public async login(@Request() req) {
    return this.authService.generateJwtAuth(req.user);
  }
}
