import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../user/test/stubs/user.stub';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {
  createProductStub,
  productEntityStub,
  productListEntitiesStub,
  responseCreatedProduct,
  responseUpdateProduct,
} from './test/stubs/product.stub';
import { ResponseCreatedProduct } from './dto/response-created-product.dto';
import { ProductNotCreatedException } from './exceptions/product-not-created.exception';
import { UnauthorizedException } from '@nestjs/common';
import { ProductNotFoundException } from './exceptions/product-not-found.exception';
import { RequestUpdateProductDto } from './dto/request-update-product.dto';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn().mockResolvedValue(productEntityStub),
            findAll: jest.fn().mockResolvedValue(productListEntitiesStub),
            update: jest.fn(),
            findOneOrFail: jest.fn().mockResolvedValue(productEntityStub),
            deleteById: jest.fn().mockResolvedValue(undefined),
            findOneOrFailByUserID: jest
              .fn()
              .mockResolvedValue(productEntityStub),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('productController', () => {
    describe('create', () => {
      it('Should create new product', async () => {
        const req = {
          user: { userId: 'id-mocked' },
        } as Partial<RequestWithUser>;

        const created = await productController.create(
          req as RequestWithUser,
          createProductStub,
        );

        expect(created).toEqual(responseCreatedProduct);
      });

      it('Should throw ProductNotCreatedException', async () => {
        const req = {
          user: { userId: 'id-mocked' },
        } as Partial<RequestWithUser>;
        const newProduct = {} as CreateProductDto;
        jest
          .spyOn(productController, 'create')
          .mockRejectedValueOnce(new ProductNotCreatedException());

        const created = productController.create(
          req as RequestWithUser,
          newProduct,
        );

        expect(created).rejects.toThrowError();
      });

      it('Should throw UnauthorizedException', async () => {
        const req = {} as Partial<RequestWithUser>;
        const newProduct = {} as CreateProductDto;
        jest
          .spyOn(productController, 'create')
          .mockRejectedValueOnce(new UnauthorizedException());

        const created = productController.create(
          req as RequestWithUser,
          newProduct,
        );

        expect(created).rejects.toThrowError();
      });
    });

    describe('findAll', () => {
      it('should get all products by user', async () => {
        const req = {
          user: { userId: 'id-mocked' },
        } as Partial<RequestWithUser>;
        const products = await productController.findAll(
          req as RequestWithUser,
        );

        expect(products).toEqual(productListEntitiesStub);
      });

      it('Should throw UnauthorizedException', async () => {
        jest
          .spyOn(productController, 'findAll')
          .mockRejectedValueOnce(new UnauthorizedException());

        const products = productController.findAll({} as RequestWithUser);

        expect(products).rejects.toThrowError();
      });
    });

    describe('update', () => {
      it('Should update product', async () => {
        const updatedProductEntity = { ...productEntityStub, name: 'updated' };
        const req = {
          user: { userId: 'user-a' },
        } as Partial<RequestWithUser>;
        jest
          .spyOn(productService, 'findOneOrFailByUserID')
          .mockResolvedValueOnce(productEntityStub);
        jest
          .spyOn(productService, 'update')
          .mockResolvedValueOnce(updatedProductEntity);

        const updated = await productController.update(
          req as RequestWithUser,
          'product-fake-uuid',
          updatedProductEntity,
        );

        expect(updated).toEqual({ ...responseUpdateProduct, name: 'updated' });
      });

      it('Should throw error when product not found', async () => {
        jest
          .spyOn(productService, 'findOneOrFailByUserID')
          .mockRejectedValueOnce(new ProductNotFoundException());

        const updated = productController.update(
          {} as RequestWithUser,
          'product-fake-uuid',
          {} as RequestUpdateProductDto,
        );

        expect(updated).rejects.toThrowError();
      });
    });

    describe('delete', () => {
      it('should delete product', async () => {
        const req = {
          user: { userId: 'user-a' },
        } as Partial<RequestWithUser>;
        const deleted = await productController.delete(
          req as RequestWithUser,
          'product-uuid',
        );

        expect(deleted).toBeUndefined();
      });
      it('should throw ProductNotDeletedException when not found', async () => {
        jest
          .spyOn(productService, 'findOneOrFailByUserID')
          .mockRejectedValueOnce(new ProductNotFoundException());

        const deleted = productController.delete(
          {} as RequestWithUser,
          'product-uuid',
        );

        expect(deleted).rejects.toThrowError();
      });
    });
  });
});
