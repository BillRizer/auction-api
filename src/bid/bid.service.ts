import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid } from './entities/bid.entity';
import { BidNotCreatedException } from './exceptions/bid-not-created.execption';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
  ) {}
  async create(userId: string, productId: string, createBidDto: CreateBidDto) {
    try {
      const created = await this.bidRepository.create({
        ...createBidDto,
        userId,
        productId,
      });
      return await this.bidRepository.save(created);
    } catch (error) {
      //TODO log here
      throw new BidNotCreatedException();
    }
  }

  async findAllByProductId(productId: string) {
    return await this.bidRepository.find({
      where: { productId: productId },
    });
  }

  async findLastOneByProductId(productId: string): Promise<Bid> {
    return await this.bidRepository.findOne({
      where: { productId: productId },
      order: { createdAt: 'DESC' },
    });
  }
}
