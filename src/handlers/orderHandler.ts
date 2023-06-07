import { Application, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import { Order, OrderTable } from '../models/order';
import { Product } from '../models/product';
import { OrderProduct, OrderProductTable } from '../models/order_products';
import { UserTable } from '../models/user';
import { User } from '../models/user';

const orderTable: OrderTable = new OrderTable();
const userTable: UserTable = new UserTable();
const orderProductTable: OrderProductTable = new OrderProductTable();

/**
 * @description - index function to grab orders - sends back the list of orders to front end
 * @param {Request} _req - http request 
 * @param {Response} res - http response
 * @returns {Promise<void>}
 */
const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const order: Order[] = await orderTable.index();
    res.json(order);
  } catch (error) {
    res.send('An error has occured')
    throw new Error(`An error has occured: ${error}`);
  }
};

/**
 * @description = function that gets the current order, passes a jwt for verification. and then sends back an active order based on username
 * @param {Request} req - http request 
 * @param {Response} res - http response
 * @returns {Promise<void>}
 */
const currentOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    try {
      jwt.verify(req.params.token, process.env.TOKEN as Secret);
    } catch (error) {
      res.status(401);
      res.json('Unauthorized user.');
      return;
    }
    const order: Order = await orderTable.show(req.params.username);
    if (order.status === 'active') {
      res.json(order);
    } else {
      res.send(`There is no active order for user ${req.params.username}.`)
    }
  } catch (error) {
    res.send('An error has occured');
    throw new Error(`An error has occured: ${error}`);
  }
};

/**
 * @description - function that creates a new order. will send order info back to front end with success message
 * will also verify username against userdata and add info to order_products table
 * @param {Request} req - http request 
 * @param {Response} res - http response
 * @returns {Promise<void>}
 */
const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body) {
      res.send('No post request body found!');
      return;
    }

    const userData: User[] = await userTable.index();
    let userId: number;
    userData.forEach((user: User) => {
      if (user.username === req.params.username) {
        // @ts-ignore - adding since ts is seeing user.id as possibly undefined due to type having 'id?: number' optional casting
        userId = user.id
      }
    })

    const order: Order = {
      id: Math.floor(Math.random() * 10e6),
      productIds: getProductIds(req.body.productsInOrder),
      productsInOrder: req.body.productsInOrder,
      productQuantities: req.body.productsInOrder.length,
      username: req.params.username,
      // @ts-ignore - adding ignore as getting ts error in relation to assigning variable
      userId: userId,
      status: req.body.status
    };
    await createOrderProductTableRelation(order);
    const newOrder: Order = await orderTable.create(order);


    const orderInfo = {
      ...newOrder,
      message: `Order #${newOrder.id} created for user ${order.userId}`
    };
    res.json(orderInfo);
  } catch (error) {
    res.send('An error has occured');
    throw new Error(`An error has occured: ${error}`);
  }
};

/**
 * @description - function that adds product info and user info to a order_product table
 * @param {Order} order - passed order data
 * @returns {Promise<void>} 
 */
const createOrderProductTableRelation = async (order: Order): Promise<void> => {
try {
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
      await orderProductTable.create(temp)
    }
} catch (error) {
  throw new Error(`Error: ${error}`);
}
};

/**
 * @description - helper function that maps the product array and returns an array of ids
 * @param {Product[]} products - array of products to use
 * @returns {number[]} - new array of product ids
 */
const getProductIds = (products: Product[]): number[] => {
  return products.map((product: Product) => product.id);
};

/**
 * @description - function that houses the http endpoints
 * @param {Application} app - the express app
 * @returns {void}
 */
const orderRoutes = (app: Application): void => {
  app.get('/orders', index);
  app.get('/getCurrentOrder/:username/:token', currentOrder);
  app.post('/createOrder/:username', createOrder);
};

export default orderRoutes;