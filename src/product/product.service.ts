import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { RequestUpdateProductDto } from './dto/request-update-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const created = await this.productRepository.create({
        ...createProductDto,
      });
      return await this.productRepository.save(created);
    } catch (error) {
      //TODO log here
      return null;
    }
  }

  async findAll(userId: string) {
    return await this.productRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: string) {
    return await this.findOneOrFail(id);
  }

  async findOneOrFail(id: string): Promise<Product> {
    try {
      return await this.productRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      throw new ProductNotFoundException();
    }
  }
  async findOneOrFailByUserID(id: string, userId: string): Promise<Product> {
    try {
      return await this.productRepository.findOneOrFail({
        where: { id: id, user: { id: userId } },
      });
    } catch (error) {
      throw new ProductNotFoundException();
    }
  }
  async update(
    productId: string,
    requestUpdateProductDto: RequestUpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.findOneOrFail(productId);
      this.productRepository.merge(product, requestUpdateProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      throw new NotFoundException('Could not update');
    }
  }

  async deleteById(id: string) {
    await this.findOneOrFail(id);
    await this.productRepository.softDelete(id);
  }
}
