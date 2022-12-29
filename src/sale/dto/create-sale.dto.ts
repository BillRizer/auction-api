import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateSaleDto {
  @IsNumber()
  public value: number;
}
