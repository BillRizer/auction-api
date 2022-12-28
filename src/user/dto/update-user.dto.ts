import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  /**
   * e-mail is required and used for login
   * @example email.new@valid.com
   */
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * old password, needed for update password
   * @example mypass
   */
  @IsString()
  @IsOptional()
  old_password?: string;

  /**
   * new password, use strong password
   * @example mypass
   */
  @IsString()
  @IsOptional()
  password?: string;

  /**
   * Use your own name or be creative
   * @example 'John Smith Updated'
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Money initial in your account
   * @example 123.30
   * @default 0
   */
  @IsNumber()
  @IsOptional()
  credit?: number;
}
