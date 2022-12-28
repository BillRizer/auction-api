import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { getCurrentTimeISO } from '../utils/time';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { ProductService } from '../product/product.service';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { BidLowerException } from './exceptions/bid-lower.execption';
import { BidTimeoutException } from './exceptions/bid-timeout.execption';
import { LoggerAdapter } from '../logger/logger';
import { ApiTags } from '@nestjs/swagger';
import { ResponseBidDto } from './dto/response-bid';
@ApiTags('Bid')
@Controller('bid')
export class BidController {
  constructor(
    private readonly bidService: BidService,
    private productService: ProductService,
  ) {}

  @Post(':id')
  @HttpCode(201)
  async create(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() createBidDto: CreateBidDto,
  ) {
    const userId = req?.user?.userId;
    const product = await this.productService.findOneOrFail(productId);

    if (new Date(getCurrentTimeISO()) > new Date(product.endsAt)) {
      throw new BidTimeoutException();
    }
    const lastBid = await this.bidService.findLastOneByProductId(productId);
    if (lastBid) {
      if (createBidDto.value <= lastBid.value) {
        throw new BidLowerException(lastBid.value);
      }
    }
    LoggerAdapter.logRawMessage(
      'activities',
      `created bid - userid=${userId} productId=${productId} productName=${product.name} value=${createBidDto.value}`,
    );
    await this.bidService.create(userId, productId, createBidDto);
  }

  @Get(':id')
  async findAllByProductId(@Param('id', ParseUUIDPipe) productId: string) {
    const bids = await this.bidService.findAllByProductId(productId);
    return <Array<ResponseBidDto>>bids;
  }
}
