import { Test, TestingModule } from '@nestjs/testing';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { Bid } from './entities/bid.entity';
import { BidNotCreatedException } from './exceptions/bid-not-created.execption';
import {
  bidEntityStub,
  bidListEntityStub,
  createBidStub,
} from './test/stubs/bid.stub';

describe('BidController', () => {
  let bidController: BidController;
  let bidService: BidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidController],
      providers: [
        {
          provide: BidService,
          useValue: {
            create: jest.fn().mockResolvedValue(bidEntityStub),
            findAllByProductId: jest.fn().mockResolvedValue(bidListEntityStub),
          },
        },
      ],
    }).compile();

    bidController = module.get<BidController>(BidController);
    bidService = module.get<BidService>(BidService);
  });

  it('should be defined', () => {
    expect(bidController).toBeDefined();
    expect(bidService).toBeDefined();
  });

  describe('create', () => {
    it('should create new bid for product', async () => {
      const created = await bidController.create(
        {} as RequestWithUser,
        'uuid',
        createBidStub,
      );
      expect(created).toBeUndefined();
      expect(bidService.create).toHaveBeenCalledTimes(1);
      expect(created).resolves;
    });

    it('should throw error BidNotCreatedException', async () => {
      jest
        .spyOn(bidService, 'create')
        .mockRejectedValueOnce(new BidNotCreatedException());

      const created = bidController.create(
        {} as RequestWithUser,
        'uuid',
        createBidStub,
      );

      expect(created).rejects.toThrowError();
    });
  });

  describe('findAllByProductId', () => {
    it('should get all products avaibles for auction', async () => {
      const products = await bidController.findAllByProductId('product-uuid');

      expect(products).toEqual(bidListEntityStub);
    });
    it('should get empty when not exist product for id', async () => {
      jest.spyOn(bidService, 'findAllByProductId').mockResolvedValueOnce([]);

      const products = await bidController.findAllByProductId('product-uuid');

      expect(products).toEqual([]);
      expect(products.length).toEqual(0);
      expect(bidService.findAllByProductId).toHaveBeenCalledTimes(1);
    });
  });
});
