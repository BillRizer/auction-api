import {
  isBoolean,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RequestUpdateProductDto } from './request-update-product.dto';

export class UpdateProductDto extends RequestUpdateProductDto {
  @IsString()
  public endsAt?: string;

  @IsBoolean()
  @IsOptional()
  public availableForAuction?: boolean;

  @IsBoolean()
  @IsOptional()
  public sold?: boolean;
}
