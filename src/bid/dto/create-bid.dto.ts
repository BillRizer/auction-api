import { IsNumber, Max, Min } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @Min(0)
  @Max(100000000)
  public value: number;
}
