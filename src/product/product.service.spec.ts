import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import {
  createProductStub,
  productEntityStub,
  productListEntitiesStub,
} from './test/stubs/product.stub';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn().mockResolvedValue(productEntityStub),
            save: jest.fn().mockResolvedValue(productEntityStub),
            find: jest.fn().mockResolvedValue(productListEntitiesStub),
            findOneOrFail: jest.fn().mockResolvedValue(productEntityStub),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create new product', async () => {
      const created = await productService.create(createProductStub);

      expect(created).toEqual(productEntityStub);
    });

    it('should throw error', async () => {
      jest.spyOn(productRepository, 'save').mockRejectedValueOnce(new Error());

      const created = productService.create(createProductStub);

      expect(created).resolves.toEqual(null);
    });
  });

  describe('findAll', () => {
    it('should return list of products', async () => {
      const products = await productService.findAll('fake-user-id-uuid');

      expect(products).toEqual(productListEntitiesStub);
    });

    it('should return empty list', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValueOnce([]);

      const products = await productService.findAll('fake-user-id-uuid');

      expect(products).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return product', async () => {
      const product = await productService.findOne('fake-user-id-uuid');

      expect(product).toEqual(productEntityStub);
    });
  });
});
