import { isBoolean, IsBoolean, IsObject, IsString } from 'class-validator';
import { RequestCreateProductDto } from './request-create-product';

export class CreateProductDto extends RequestCreateProductDto {
  @IsObject()
  public user: { id: string };

  @IsBoolean()
  public availableForAuction: boolean;

  @IsBoolean()
  public sold: boolean;

  @IsString()
  public endsAt: string;
}
