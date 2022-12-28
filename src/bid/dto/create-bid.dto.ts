import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @Min(0)
  @Max(100000000)
  @ApiProperty({
    description: 'bid value',
    type: Number,
    example: 1.99,
  })
  public value: number;
}
