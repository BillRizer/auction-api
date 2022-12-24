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
  HttpCode,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { RequestCreateProductDto } from './dto/request-create-product';
import { ApiTags } from '@nestjs/swagger';
import { ProductNotCreatedException } from './exceptions/product-not-created.exception';
import { ResponseCreatedProduct } from './dto/response-created-product.dto';
import { RequestUpdateProductDto } from './dto/request-update-product.dto';
import { ProductNotDeletedException } from './exceptions/product-not-deleted.exception';
import { ResponseUpdatedProduct } from './dto/response-updated-product.dto';
import { Public } from '../auth/decorator/public.decorator';
import { getCurrentDateTimeUTCWithoutSec } from 'src/utils/time';

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
        endsAt: getCurrentDateTimeUTCWithoutSec(),
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
    @Param('id') productId: string,
    @Body() requestUpdateProductDto: RequestUpdateProductDto,
  ) {
    const userId = req?.user?.userId;
    const product = await this.productService.findOneOrFailByUserID(
      productId,
      userId,
    );
    const updateProduct: RequestUpdateProductDto = {
      category: requestUpdateProductDto.category,
      availableForAuction: requestUpdateProductDto.availableForAuction,
      description: requestUpdateProductDto.description,
      name: requestUpdateProductDto.name,
      sold: requestUpdateProductDto.sold,
    };
    const { user, deletedAt, ...rest } = await this.productService.update(
      productId,
      updateProduct,
    );

    return <ResponseUpdatedProduct>rest;
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id') productId: string,
  ) {
    try {
      //TODO refactor this for not repeat it again
      const userId = req?.user?.userId;
      const product = await this.productService.findOneOrFailByUserID(
        productId,
        userId,
      );

      await this.productService.deleteById(productId);
    } catch (error) {
      throw new ProductNotDeletedException();
    }
  }

  @Get('avaible-for-auction')
  async findAllAvaibleForAuction() {
    return await this.productService.findAllAvaibleForAuction();
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(+id);
  // }
}
