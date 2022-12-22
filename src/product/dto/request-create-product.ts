import { IsString } from 'class-validator';

export class RequestCreateProductDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  public category: string;
}
