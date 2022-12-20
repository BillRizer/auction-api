import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail Field missing' })
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'Name Field missing' })
  name: string;

  @IsNumber()
  @IsOptional()
  credit?: number;
}
