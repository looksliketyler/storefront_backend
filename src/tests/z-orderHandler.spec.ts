import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

import orderRoutes from '../handlers/orderHandler';
import { OrderTable } from '../models/order';
import { Product, ProductTable } from '../models/product';
import { User, UserTable } from '../models/user';

const testDataPath = path.join(__dirname, '../../test_data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

const app = express();
app.use(bodyParser.json())
orderRoutes(app);

const userTable = new UserTable();
const productTable = new ProductTable();
const mockOrderData = testData.orderHandlerData;
let user: User;

const setUpUserAndProduct = async (products: Product[]) => {
  user = await userTable.create({id: Math.floor(Math.random() * 10e6), firstname: 'Terry', lastname: 'Tester', username: 'TesterTerry12', password: 'testthetest12$$'});
  for (const product of products) {
    await productTable.create(product);
  }
};

describe('orderHandler.js', () => {
  it('should have an orderRoutes function', () => {
    expect(orderRoutes).toBeDefined();
  });

  it('should create a new order', async () => {
    await setUpUserAndProduct(mockOrderData.mockPostRequest.productsInOrder)
    const response = await request(app).post(`/createOrder/${user.username}`).send(mockOrderData.mockPostRequest);
    expect(response.status).toBe(200);
    expect(response.body.message).withContext(`created for user ${user.id}`);
  });

  it('should return a list of orders', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeTruthy();
    response.body.forEach((order: any) => { // order is type any due to the database format has no defined type
      expect(order.product_ids.length).toBeTruthy();
    });
    // last test for order table, clearing db
    const orderTable = new OrderTable();
    await orderTable.clearTestDb();
    await userTable.clearTestDb();
    await productTable.clearTestDb();
  });
});