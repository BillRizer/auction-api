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


});
