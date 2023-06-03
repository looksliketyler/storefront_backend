import { ProductTable, Product } from '../models/product';

const productTable = new ProductTable();

const mockProducts = [
  {
    name: 'Medical Tricorder - Voyager',
    price: '99.99',
    id: 6874093
  },
  {
    name: 'Tricorder - TNG',
    price: '89.99',
    id: 3698121
  }
];

describe('Product model', () => {
  it('should have an index method defined', () => {
    expect(productTable.index).toBeDefined();
  });

  it('should create a new product', async () => {
    const result = await productTable.create(mockProducts[0]);
    expect(result).toEqual(mockProducts[0]);
  });

  it('should show a singular product by passing an id', async () => {
    const result = await productTable.show(mockProducts[0].id.toString());
    expect(result).toEqual(mockProducts[0] as never);
  });
});