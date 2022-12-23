import { CreateBidDto } from '../../../bid/dto/create-bid.dto';
import { Bid } from '../../../bid/entities/bid.entity';

const bid = new Bid({
  id: 'uuid-stub',
  productId: 'uuid-product-id-stub',
  userId: 'uuid-user-id-stub',
  value: 100.05,
  createdAt: '',
  updatedAt: '',
  deletedAt: '',
});

export const bidEntityStub = bid;
export const bidListEntityStub = [bid, bid, bid, bid];

export const createBidStub: CreateBidDto = {
  value: bid.value,
};
