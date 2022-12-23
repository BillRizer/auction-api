import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';
import { ProductService } from './product.service';
import {
  createProductStub,
  productEntityStub,
  productListEntitiesStub,
  requestUpdateProductStub,
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
            softDelete: jest.fn().mockResolvedValue(undefined),
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
    it('should throw exception ProductNotFoundException', async () => {
      jest
        .spyOn(productRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new ProductNotFoundException());

      const product = productService.findOne('fake-user-id-uu');

      expect(product).rejects.toThrowError();
    });
  });

  describe('findOneOrFail', () => {
    it('should return product', async () => {
      const product = await productService.findOneOrFail('fake-user-id-uuid');

      expect(product).toEqual(productEntityStub);
    });
    it('should throw exception ProductNotFoundException', async () => {
      jest
        .spyOn(productRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new ProductNotFoundException());

      const product = productService.findOneOrFail('fake-user-id-uu');

      expect(product).rejects.toThrowError();
    });
  });

  describe('deleteById', () => {
    it('should delete product', async () => {
      const deleted = await productService.deleteById('fake-uuid');

      expect(deleted).toBeUndefined();
      expect(productRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(productRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw error when delete when not found', async () => {
      jest
        .spyOn(productRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      const deleted = productRepository.softDelete('fake-uuid');

      expect(deleted).rejects.toThrowError();
    });
  });
});
