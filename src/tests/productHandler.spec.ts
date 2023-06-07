import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

import productRoutes from '../handlers/productHandler';
import { ProductTable } from '../models/product';
import { UserTable } from '../models/user';

const app = express();
app.use(bodyParser.json());
productRoutes(app);

const testDataPath = path.join(__dirname, '../../test_data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

const mockProductData = testData.productHandlerData;
let productIdParam: string;

describe('productHandler.js', () => {
  it('should have a productRoutes function', () => {
    expect(productRoutes).toBeDefined();
  });

  it('should create a new product', async () => {
    const userTable = new UserTable();
    const users = await userTable.index();
    const token = users[0].token;
    mockProductData.mockCreateProductRequest.token = token;
    const response = await request(app).post('/createProduct').send(mockProductData.mockCreateProductRequest);
    productIdParam = response.body.id.toString();
    expect(response.status).toBe(200);
    expect(response.body.id).toBeTruthy();;
  });

  it('should get all products returned', async () => {
    const response = await request(app).get('/getAllProducts');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeTruthy();
  });

  it('should get a single product by passing an id', async () => {
    mockProductData.mockSingleProductResponse.id = +productIdParam;
    const response = await request(app).get(`/getProduct/${productIdParam}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProductData.mockSingleProductResponse);
    // last test for product table, clearing db
    const productTable = new ProductTable();
    productTable.clearTestDb();
  });
});