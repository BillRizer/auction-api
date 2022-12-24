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
import RequestWithUser from 'src/auth/interface/request-with-user.interface';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { BidNotCreatedException } from './exceptions/bid-not-created.execption';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post(':id')
  @HttpCode(201)
  async create(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() createBidDto: CreateBidDto,
  ) {
    const userId = req?.user?.userId;

    await this.bidService.create(userId, productId, createBidDto);
  }

  @Get(':id')
  async findAllByProductId(@Param('id', ParseUUIDPipe) productId: string) {
    return await this.bidService.findAllByProductId(productId);
  }
}
