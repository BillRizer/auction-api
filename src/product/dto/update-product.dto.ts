import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { RequestUpdateProductDto } from './request-update-product.dto';

export class UpdateProductDto extends RequestUpdateProductDto {
  @IsString()
  public userId?: string;
}
