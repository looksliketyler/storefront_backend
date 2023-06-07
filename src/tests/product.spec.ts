import fs from 'fs';
import path from 'path';

import { ProductTable } from '../models/product';

const testDataPath = path.join(__dirname, '../../test_data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

const productTable = new ProductTable();

const mockProducts = testData.productModelData.mockProducts;

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