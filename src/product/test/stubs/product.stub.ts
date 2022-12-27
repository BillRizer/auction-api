import { RequestUpdateProductDto } from '../../../product/dto/request-update-product.dto';
import { ResponseUpdatedProduct } from '../../../product/dto/response-updated-product.dto';
import { CreateProductDto } from '../../../product/dto/create-product.dto';
import { ResponseCreatedProduct } from '../../../product/dto/response-created-product.dto';
import { Product } from '../../../product/entities/product.entity';

const product = new Product({
  id: 'static-uuid',
  name: 'Stub name ',
  description: 'My description',
  category: 'rare',
  user: { id: '' },
  availableForAuction: false,
  sold: false,
  endsAt: '',
  createdAt: '2022-01-01 00:00:00.095',
  updatedAt: '2022-01-01 00:00:00.095',
  deletedAt: '',
});

export const productEntityStub = product;

export const responseCreatedProduct: ResponseCreatedProduct = {
  id: product.id,
  name: product.name,
  description: product.description,
  category: product.category,
  availableForAuction: product.availableForAuction,
  sold: product.sold,
  endsAt: product.endsAt,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  user_id: product.user.id,
};
export const responseUpdateProduct: ResponseUpdatedProduct = {
  id: product.id,
  name: product.name,
  description: product.description,
  category: product.category,
  availableForAuction: product.availableForAuction,
  sold: product.sold,
  endsAt: product.endsAt,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
};

export const createProductStub: CreateProductDto = {
  availableForAuction: productEntityStub.availableForAuction,
  category: productEntityStub.category,
  description: productEntityStub.description,
  endsAt: productEntityStub.endsAt,
  name: productEntityStub.name,
  sold: productEntityStub.sold,
  user: { id: productEntityStub.id },
};
export const requestUpdateProductStub: RequestUpdateProductDto = {
  availableForAuction: product.availableForAuction,
  category: product.category,
  description: product.description,
  name: product.name,
  sold: product.sold,
};
export const productListEntitiesStub: Array<Product> = [
  { ...productEntityStub, id: '000-0000-1', name: 'first' },
  { ...productEntityStub, id: '000-0000-2', name: 'second' },
  { ...productEntityStub, id: '000-0000-3', name: 'third' },
];
