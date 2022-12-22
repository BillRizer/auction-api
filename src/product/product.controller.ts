import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { getCurrentTimeUTC } from '../utils/helpers';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { RequestCreateProductDto } from './dto/request-create-product';
import { ApiTags } from '@nestjs/swagger';
import { ProductNotCreatedException } from './exceptions/product-not-created.exception';
import { ResponseCreatedProduct } from './dto/response-created-product.dto';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() requestCreateProductDto: RequestCreateProductDto,
  ) {
    const id = req?.user?.userId;
    if (!id) {
      throw new UnauthorizedException();
    }

    try {
      const newProduct: CreateProductDto = {
        category: requestCreateProductDto.category,
        description: requestCreateProductDto.description,
        name: requestCreateProductDto.name,
        availableForAuction: false,
        endsAt: getCurrentTimeUTC(),
        sold: false,
        user: { id: id },
      };

      const created = await this.productService.create(newProduct);
      if (!created) {
        throw new ProductNotCreatedException();
      }
      const { deletedAt, user, ...rest } = created;
      return <ResponseCreatedProduct>{ ...rest, user_id: created.user.id };
    } catch (error) {
      console.log(error);
      throw new ProductNotCreatedException();
    }
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    const userId = req?.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.productService.findAll(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.remove(+id);
  // }
}
