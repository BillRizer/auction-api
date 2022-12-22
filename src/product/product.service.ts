import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

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
      console.log(error);

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
      throw new NotFoundException('Could not find this product');
    }
  }
}
