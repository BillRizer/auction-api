import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid } from './entities/bid.entity';
import { bidEntityStub, createBidStub } from './test/stubs/bid.stub';

describe('BidService', () => {
  let bidService: BidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidService,
        {
          provide: getRepositoryToken(Bid),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(bidEntityStub),
          },
        },
      ],
    }).compile();

    bidService = module.get<BidService>(BidService);
  });

  it('should be defined', () => {
    expect(bidService).toBeDefined();
  });
  describe('bidService', () => {
    it('should create new bid and return', async () => {
      const created = await bidService.create(
        bidEntityStub.userId,
        bidEntityStub.productId,
        createBidStub,
      );

      expect(created).toEqual(bidEntityStub);
    });
   
  });
});
