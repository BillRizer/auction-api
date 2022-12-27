import { PartialType } from '@nestjs/swagger';
import { CreateAuctioneerDto } from './create-auctioneer.dto';

export class UpdateAuctioneerDto extends PartialType(CreateAuctioneerDto) {}
