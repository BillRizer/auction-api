import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestCreateProductDto {
  @ApiProperty({
    description: 'product name',
    example: 'my rare product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'product description',
    example: 'rare product, manufactured by HinHow of ming dinasty',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'product category',
    example: 'rare',
  })
  @IsString()
  category: string;
}
