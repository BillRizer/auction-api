import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class RequestUpdateProductDto {
  @ApiProperty({
    description: 'product name',
    example: 'my rare product',
  })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({
    description: 'product description',
    example: 'rare product, manufactured by HinHow of ming dinasty',
  })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({
    description: 'product category',
    example: 'rare',
  })
  @IsString()
  @IsOptional()
  public category?: string;
}
