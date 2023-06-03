import { OrderTable, Order } from '../models/order';

const orderTable = new OrderTable();

const mockOrderData = {
  mockOrderRequest: {
    id: 8851647,
    productIds: ['7664989', '5470589', '6874093'],
    productQuantities: 3,
    userId: 'BestEnterpriseCaptain1701',
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
  mockOrderReponse: {
    id: 8851647,
    product_ids: [ '7664989', '5470589', '6874093' ],
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
    ]
  }
};

describe('Order model', () => {
  it('should have an index method', () => {
    expect(orderTable.index).toBeDefined();
  });

  it('should create a new order', async () => {
    const result: Order = await orderTable.create(mockOrderData.mockOrderRequest);
    expect(result).toEqual(mockOrderData.mockOrderReponse as never);
  });

  it('index method should return a list of orders', async () => {
    const result = await orderTable.index();
    expect(result).toEqual([mockOrderData.mockOrderReponse] as never);
  });
});