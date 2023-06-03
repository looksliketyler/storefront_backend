import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import orderRoutes from '../handlers/orderHandler';
import { OrderTable } from '../models/order';

const app = express();
app.use(bodyParser.json())
orderRoutes(app);

const mockOrderData = {
  mockPostRequest: {
    productsInOrder: [
      {
        name: 'Goa\'uld Staff Weapon',
        price: '149.99',
        id: 7664986
      },
      {
        name: 'Medical Tricorder - Voyager',
        price: '69.99',
        id: 5470589
      },
      {
        name: 'Tricorder - TNG',
        price: '99.99',
        id: 6874093
      }
    ],
    status: 'active'
  },
  mockOrderResponse: {
    id: 536720,
    product_ids: [ '7664986', '5470589', '6874093' ],
    product_quantities: 3,
    user_id: 'BestEnterpriseCaptain1701',
    status: 'active',
    products: [
      {
        name: 'Goa\'uld Staff Weapon',
        price: '149.99',
        id: 7664986
      },
      {
        name: 'Medical Tricorder - Voyager',
        price: '69.99',
        id: 5470589
      },
      {
        name: 'Tricorder - TNG',
        price: '99.99',
        id: 6874093
      }
    ],
    message: 'Order #536720 created for user BestEnterpriseCaptain1701'
  }
};

describe('orderHandler.js', () => {
  it('should have an orderRoutes function', () => {
    expect(orderRoutes).toBeDefined();
  });

  it('should create a new order', async () => {
    const response = await request(app).post('/createOrder/BestEnterpriseCaptain1701').send(mockOrderData.mockPostRequest);
    expect(response.status).toBe(200);
    expect(response.body.product_quantities).toEqual(mockOrderData.mockOrderResponse.products.length);
    expect(response.body.message).toContain('created for user BestEnterpriseCaptain1701');
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
    orderTable.clearTestDb();
  });
});