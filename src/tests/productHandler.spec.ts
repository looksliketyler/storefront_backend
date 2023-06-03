import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import productRoutes from '../handlers/productHandler';
import { ProductTable } from '../models/product';

const app = express();
app.use(bodyParser.json());
productRoutes(app);

const mockProductData = {
  mockCreateProductRequest: {
    name: 'Gou\'uld Staff Weapon',
    price: '149.99'
  },
  mockSingleProductResponse: {
    name: 'Medical Tricorder - Voyager',
    price: '99.99',
    id: 6874093
  }
};

describe('productHandler.js', () => {
  it('should have a productRoutes function', () => {
    expect(productRoutes).toBeDefined();
  });

  it('should hit createProduct enpoint yet return unauthorized user due to no token', async () => {
    const response = await request(app).post('/createProduct').send(mockProductData.mockCreateProductRequest);
    expect(response.status).toBe(401);
    expect(response.body).toEqual('Unauthorized user.'); // 
  });

  it('should get all products returned', async () => {
    const response = await request(app).get('/getAllProducts');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeTruthy();
  });

  it('should get a single product by passing an id', async () => {
    const response = await request(app).get(`/getProduct/6874093`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProductData.mockSingleProductResponse);
    // last test for product table, clearing db
    const productTable = new ProductTable();
    productTable.clearTestDb();
  });
});