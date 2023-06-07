import { Request, Response, Application } from "express";
import jwt, { Secret } from 'jsonwebtoken';

import { Product, ProductTable } from '../models/product';

const productTable: ProductTable = new ProductTable();

/**
 * @description - function that gets all products. sends back product array to front end
 * @param {Request} _req - http request
 * @param {Response} res - http response
 * @returns {Promise<void>}
 */
const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await productTable.index();
    res.json(products);
  } catch (error) {
    res.send('An error has occured')
    throw new Error(`An error has occured: ${error}`);
  }
};

/**
 * @description - function grabs a sinlge product by passing the id, sends to front end
 * @param {Request} req - http request 
 * @param {Response} res -http response
 * @returns {Promise<void>}
 */
const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product: Product = await productTable.show(req.params.id);
    res.json(product);    
  } catch (error) {
    res.send('An error has occured')
    throw new Error(`An error has occured: ${error}`);
  }
};

/**
 * @description - function creates new product. checks for a valid jwt and sends new product info back to front end
 * @param {Request} req - http request
 * @param {Response} res - http response 
 * @returns {Promise<void>}
 */
const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body) {
      res.send('No post request body found!');
      return;
    }

    try {
      jwt.verify(req.body.token, process.env.TOKEN as Secret);
    } catch (error) {
      res.status(401);
      res.json('Unauthorized user.');
      return;
    }

    const newProduct: Product = {
      name: req.body.name,
      price: req.body.price,
      id: Math.floor(Math.random() * 10e6),
    };

    const createdProduct: Product = await productTable.create(newProduct);
    res.json(createdProduct);
  } catch (error) {
    res.send('An error has occured')
    throw new Error(`An error has occured: ${error}`);
  }
};

/**
 * @description - function that houses the http endpoints
 * @param {Application} app - the express app
 * @returns {void}
 */
const productRoutes = (app: Application): void => {
  app.get('/getAllProducts', getAllProducts);
  app.get('/getProduct/:id', getProduct);
  app.post('/createProduct', createProduct);
};

export default productRoutes;