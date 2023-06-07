import client from '../database';

import { Product } from './product';

export type Order = {
  id: number;
  productsInOrder: Product[]
  productIds: number[];
  username: string;
  productQuantities: number,
  userId: number,
  status: string;
};

export class OrderTable {

  /**
   * @description - calls database to select all info from orders table
   * @returns {Promise<Order[]>} - array of orders
   */
  async index(): Promise<Order[]> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * from orders';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  /**
   * @description - calls database to grab a single order
   * @param {string} username - passed username to show order
   * @returns {Promise<Order>} a single order
   */
  async show(username: string): Promise<Order> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const result = await connection.query(sql, [username]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${username}. Error: ${err}`)
    }
  }

  /**
   * @description - adds a new order to database
   * @param {Order} order - the order in which to add to database
   * @returns {Promise<Order>} - the order thats been added
   */
  async create(order: Order): Promise<Order> {
    try {
      const connection = await client.connect();
      const sql = 'INSERT INTO orders (id, product_ids, product_quantities, status, user_id, products) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
      const result = await connection.query(sql, [order.id, JSON.stringify(order.productIds), order.productQuantities, order.status, order.userId, JSON.stringify(order.productsInOrder)]);
      const neworder = result.rows[0]; 
      connection.release();
      return neworder;
    } catch (err) {
      throw new Error(`Could not add new order ${order.id}. Error: ${err}`);
    }
  }

  /**
   * @description - method to clear db table
   * @returns {Promise<[]>}
   */
  async clearTestDb(): Promise<[]> {
    try {
      const connection = await client.connect();
      const result = await connection.query('DELETE FROM orders');
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error: ${err}`)
    }
  }
}