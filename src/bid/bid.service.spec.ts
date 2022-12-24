import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid } from './entities/bid.entity';
import { BidNotCreatedException } from './exceptions/bid-not-created.execption';
import {
  bidEntityStub,
  bidListEntityStub,
  createBidStub,
} from './test/stubs/bid.stub';

describe('BidService', () => {
  let bidService: BidService;
  let bidRepository: Repository<Bid>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidService,
        {
          provide: getRepositoryToken(Bid),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(bidEntityStub),
            findOne: jest.fn().mockResolvedValue(bidEntityStub),
            find: jest.fn().mockResolvedValue(bidListEntityStub),
          },
        },
      ],
    }).compile();

    bidService = module.get<BidService>(BidService);
    bidRepository = module.get<Repository<Bid>>(getRepositoryToken(Bid));
  });

  it('should be defined', () => {
    expect(bidService).toBeDefined();
    expect(bidRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create new bid and return', async () => {
      const created = await bidService.create(
        bidEntityStub.userId,
        bidEntityStub.productId,
        createBidStub,
      );

      expect(created).toEqual(bidEntityStub);
    });

    it('should throw BidNotCreatedException when not saved', async () => {
      jest
        .spyOn(bidRepository, 'save')
        .mockRejectedValueOnce(new BidNotCreatedException());

      const created = bidService.create(
        bidEntityStub.userId,
        bidEntityStub.productId,
        createBidStub,
      );

      expect(created).rejects.toThrowError();
      expect(created).rejects.toBeInstanceOf(BidNotCreatedException);
      expect(bidRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return a list of bids by productId', async () => {
      const bids = await bidService.findAllByProductId('product-id-uuid');

      expect(bids.length).toEqual(4);
    });
  });

  describe('findLastOneByProductId', () => {
    it('should get last object', async () => {
      const bid = await bidService.findLastOneByProductId('');

      expect(bid).toBeDefined();
      expect(bid).toEqual(bidEntityStub);
    });
    it('should get last object', async () => {
      jest.spyOn(bidService, 'findLastOneByProductId').mockResolvedValue(null);

      const bid = await bidService.findLastOneByProductId('');

      expect(bid).toEqual(null);
      expect(bidService.findLastOneByProductId).toHaveBeenCalledTimes(1);
    });
  });
});
