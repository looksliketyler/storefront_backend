import path from 'path';
import fs from 'fs';

import { OrderTable, Order } from '../models/order';
import { UserTable, User } from '../models/user';
import { ProductTable } from '../models/product';
import { OrderProduct, OrderProductTable } from '../models/order_products';

const testDataPath = path.join(__dirname, '../../test_data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

const orderTable = new OrderTable();
const userTable = new UserTable();
const productTable = new ProductTable();
const orderProductTable = new OrderProductTable();

const mockOrderData = testData.orderModelData;
const mockUserData = testData.userModelData.userInfoToCreate;
mockOrderData.mockOrderRequest.userId = mockUserData.id;
mockOrderData.mockOrderResponse.user_id = mockUserData.id;

const createOrderProductTableRelation = async (order: Order): Promise<void> => {
  const productIds: number[] = Array.from(new Set(order.productIds));
  const productAmount: {[key: number]: number} = order.productIds.reduce((acc: {[key: number]: number}, curVal: number) => {
    acc[curVal] = acc[curVal] ? acc[curVal] + 1 : 1;
    return acc;
  }, {});
  
  // adds an order/product/user relation for each productId that isnt duplicated
  for (const productId of productIds) {
    const temp: OrderProduct = {
      id: Math.floor(Math.random() * 10e6),
      userId: order.userId,
      productId: productId,
      quantity: productAmount[productId]
    };
    await orderProductTable.create(temp);
  }
};

const createProductsForRelation = async (order: Order): Promise<void> => {
  for (const product of order.productsInOrder) {
    await productTable.create(product);
  }
};

describe('Order model', () => {
  it('should have an index method', () => {
    expect(orderTable.index).toBeDefined();
  });
  
  it('should create a new order', async () => {
    const users: User[] = await userTable.index();
    const userId = users[0].id;
    mockOrderData.mockOrderRequest.userId = userId;
    await createProductsForRelation(mockOrderData.mockOrderRequest);
    await createOrderProductTableRelation(mockOrderData.mockOrderRequest);
    const result: Order = await orderTable.create(mockOrderData.mockOrderRequest);
    mockOrderData.mockOrderResponse.user_id = userId;
    expect(result).toEqual(mockOrderData.mockOrderResponse);
  });

  it('index method should return a list of orders', async () => {
    const result = await orderTable.index();
    expect(result).toEqual([mockOrderData.mockOrderResponse] as never);
    // clear out created data from db
    await productTable.clearTestDb();
    await orderTable.clearTestDb();
    await orderProductTable.clearTestDb();
    await userTable.clearTestDb();
  });
});