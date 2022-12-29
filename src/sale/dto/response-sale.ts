import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class ResponseSaleDto {
  @ApiProperty({
    description: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'value',
    type: Number,
    example: 1.99,
  })
  value: number;

  @ApiProperty({
    description: 'createdAt',
    example: '2022-12-27 16:47:41.726',
  })
  createdAt: string;

  @ApiProperty({
    description: 'updatedAt',
    example: '2022-12-27 16:47:41.726',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'deletedAt',
    example: null,
  })
  deletedAt: string;
}
