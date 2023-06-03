import { Application, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { Order, OrderTable } from '../models/order';
import { Product } from '../models/product';

const orderTable: OrderTable = new OrderTable();

/**
 * @description - index function to grab orders - sends back the list of orders to front end
 * @param {Request} _req - http request 
 * @param {Response} res - http response
 * @returns {Promise<void>}
 */
const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const order = await orderTable.index();
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
    const order: Order = {
      id: Math.floor(Math.random() * 10e6),
      productIds: getProductIds(req.body.productsInOrder),
      productsInOrder: req.body.productsInOrder,
      productQuantities: req.body.productsInOrder.length,
      userId: req.params.username,
      status: req.body.status
    };
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
 * @description - helper function that maps the product array and returns an array of ids
 * @param {Product[]} products - array of products to use
 * @returns {string[]} - new array of product ids
 */
const getProductIds = (products: Product[]): string[] => {
  return products.map((product: Product) => product.id.toString());
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