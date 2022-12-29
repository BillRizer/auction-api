import { CreateSaleDto } from '../../../sale/dto/create-sale.dto';
import { Sale } from '../../../sale/entities/sale.entity';

const sale = new Sale({
  id: 'uuid-stub',
  productId: 'uuid-product-id-stub',
  userId: 'uuid-user-id-stub',
  value: 100.05,
  createdAt: '',
  updatedAt: '',
  deletedAt: '',
});

export const saleEntityStub = sale;
export const saleListEntityStub = [sale, sale, sale, sale];

export const createSaleStub: CreateSaleDto = {
  value: sale.value,
};
