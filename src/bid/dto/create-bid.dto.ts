import { IsNumber } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  public value: number;
}
