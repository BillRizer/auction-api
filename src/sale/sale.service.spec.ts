import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { SaleNotCreatedException } from './exceptions/sale-not-created.execption';
import {
  saleEntityStub,
  saleListEntityStub,
  createSaleStub,
} from './test/stubs/sale.stub';

describe('SaleService', () => {
  let saleService: SaleService;
  let saleRepository: Repository<Sale>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        {
          provide: getRepositoryToken(Sale),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(saleEntityStub),
            findOne: jest.fn().mockResolvedValue(saleEntityStub),
            find: jest.fn().mockResolvedValue(saleListEntityStub),
          },
        },
      ],
    }).compile();

    saleService = module.get<SaleService>(SaleService);
    saleRepository = module.get<Repository<Sale>>(getRepositoryToken(Sale));
  });

  it('should be defined', () => {
    expect(saleService).toBeDefined();
    expect(saleRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create new sale and return', async () => {
      const created = await saleService.create(
        saleEntityStub.userId,
        saleEntityStub.productId,
        createSaleStub,
      );

      expect(created).toEqual(saleEntityStub);
    });

    it('should throw SaleNotCreatedException when not saved', async () => {
      jest
        .spyOn(saleRepository, 'save')
        .mockRejectedValueOnce(new SaleNotCreatedException());

      const created = saleService.create(
        saleEntityStub.userId,
        saleEntityStub.productId,
        createSaleStub,
      );

      expect(created).rejects.toThrowError();
      expect(created).rejects.toBeInstanceOf(SaleNotCreatedException);
      expect(saleRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return a list of sales by productId', async () => {
      const sales = await saleService.findAll();

      expect(sales.length).toEqual(4);
    });
  });
});
