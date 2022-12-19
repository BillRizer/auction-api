import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
@Module({
  controllers: [AuthController],
  imports: [PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
