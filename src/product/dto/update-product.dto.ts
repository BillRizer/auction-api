import { isBoolean, IsBoolean, IsObject, IsString } from 'class-validator';
import { RequestUpdateProductDto } from './request-update-product.dto';

export class UpdateProductDto extends RequestUpdateProductDto {
  @IsString()
  public endsAt?: string;
}
