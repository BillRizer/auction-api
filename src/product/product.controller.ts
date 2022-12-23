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
import { RequestUpdateProductDto } from './dto/request-update-product.dto';

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
  async findAll(@Request() req: RequestWithUser) {
    const userId = req?.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.productService.findAll(userId);
  }

  @Patch(':id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() requestUpdateProductDto: RequestUpdateProductDto,
  ) {
    const userId = req?.user?.userId;
    const product = await this.productService.findOneOrFail(id);

    if (!userId || product.user.id != userId) {
      throw new UnauthorizedException();
    }

    return await this.productService.update(id, requestUpdateProductDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.remove(+id);
  // }
}
