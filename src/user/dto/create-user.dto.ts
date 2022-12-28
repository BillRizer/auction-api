import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  /**
   * e-mail is required and used for login
   * @example email.new@valid.com
   */
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail Field missing' })
  email: string;

  /**
   * password, use strong password
   * @example mypass
   */

  @IsString()
  @IsOptional()
  password?: string;

  /**
   * Use your own name or be creative
   * @example 'John Smith'
   */

  @IsString()
  @IsNotEmpty({ message: 'Name Field missing' })
  name: string;

  /**
   * Money initial in your account
   * @example 123.30
   * @default 0
   */
  @IsNumber()
  @IsOptional()
  credit?: number;
}
