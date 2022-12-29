import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product/product.service';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { saleEntityStub, saleListEntityStub } from './test/stubs/sale.stub';
import { productEntityStub } from '../product/test/stubs/product.stub';

describe('SaleController', () => {
  let saleController: SaleController;
  let saleService: SaleService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        {
          provide: SaleService,
          useValue: {
            create: jest.fn().mockResolvedValue(saleEntityStub),
            findAll: jest.fn().mockResolvedValue(saleListEntityStub),
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

    saleController = module.get<SaleController>(SaleController);
    saleService = module.get<SaleService>(SaleService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(saleController).toBeDefined();
    expect(saleService).toBeDefined();
  });

  describe('findAll', () => {
    it('should get all products availables for auction', async () => {
      const products = await saleController.findAll();

      expect(products).toEqual(saleListEntityStub);
    });

    it('should get empty when not exist product for id', async () => {
      jest.spyOn(saleService, 'findAll').mockResolvedValueOnce([]);

      const products = await saleController.findAll();

      expect(products).toEqual([]);
      expect(products.length).toEqual(0);
      expect(saleService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
