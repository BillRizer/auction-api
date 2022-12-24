import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product/product.service';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { Bid } from './entities/bid.entity';
import { BidNotCreatedException } from './exceptions/bid-not-created.execption';
import {
  bidEntityStub,
  bidListEntityStub,
  createBidStub,
} from './test/stubs/bid.stub';
import { productEntityStub } from '../product/test/stubs/product.stub';
import { ProductNotFoundException } from '../product/exceptions/product-not-found.exception';

describe('BidController', () => {
  let bidController: BidController;
  let bidService: BidService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidController],
      providers: [
        {
          provide: BidService,
          useValue: {
            create: jest.fn().mockResolvedValue(bidEntityStub),
            findAllByProductId: jest.fn().mockResolvedValue(bidListEntityStub),
            findLastOneByProductId: jest.fn().mockResolvedValue(bidEntityStub),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValueOnce(productEntityStub),
          },
        },
      ],
    }).compile();

    bidController = module.get<BidController>(BidController);
    bidService = module.get<BidService>(BidService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(bidController).toBeDefined();
    expect(bidService).toBeDefined();
  });

  describe('create', () => {
    it('should create new bid for product', async () => {
      jest
        .spyOn(bidService, 'findLastOneByProductId')
        .mockResolvedValueOnce(bidEntityStub);

      const created = await bidController.create(
        {} as RequestWithUser,
        'uuid',
        { ...createBidStub, value: bidEntityStub.value + 1 },
      );

      expect(created).toBeUndefined();
      expect(bidService.create).toHaveBeenCalledTimes(1);
      expect(created).resolves;
    });

    it('should prevent create bid than productId not found', async () => {
      jest
        .spyOn(productService, 'findOneOrFail')
        .mockRejectedValueOnce(new ProductNotFoundException());

      const created = bidController.create(
        {} as RequestWithUser,
        'uuid',
        createBidStub,
      );

      expect(created).rejects.toThrowError();
    });

    it('should prevent create bid with lower value than the current one', async () => {
      jest
        .spyOn(bidService, 'findLastOneByProductId')
        .mockResolvedValueOnce(bidEntityStub);

      const created = bidController.create({} as RequestWithUser, 'uuid', {
        ...createBidStub,
      });

      expect(created).rejects.toThrowError();
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
    it('should get all products availables for auction', async () => {
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
