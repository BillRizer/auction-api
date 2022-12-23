import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class RequestUpdateProductDto {
  @IsBoolean()
  @IsOptional()
  public availableForAuction?: boolean;

  @IsBoolean()
  @IsOptional()
  public sold?: boolean;

  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public category?: string;
}
