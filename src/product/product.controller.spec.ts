import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../user/test/stubs/user.stub';
import RequestWithUser from '../auth/interface/request-with-user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {
  productEntityStub,
  responseCreatedProduct,
} from './test/stubs/product.stub';
import { ResponseCreatedProduct } from './dto/response-created-product.dto';
import { ProductNotCreatedException } from './exceptions/product-not-created.exception';

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
    it('Should create new product', async () => {
      const req = { user: { userId: 'id-mocked' } } as Partial<RequestWithUser>;
      const newProduct: CreateProductDto = {
        ...productEntityStub,
        user: { id: productEntityStub.id },
      };

      const created = await productController.create(
        req as RequestWithUser,
        newProduct,
      );

      expect(created).toEqual(responseCreatedProduct);
    });

    it('Should throw ProductNotCreatedException', async () => {
      const req = { user: { userId: 'id-mocked' } } as Partial<RequestWithUser>;
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
  });
});
