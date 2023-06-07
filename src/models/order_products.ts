import client from '../database';

export type OrderProduct = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
};

export class OrderProductTable {
  public async create(dataObj: any): Promise<void> {
    try {
      const connection = await client.connect();
      const sql = 'INSERT INTO order_products (id, user_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *';
      const result = await connection.query(sql, [dataObj.id, dataObj.userId, dataObj.productId, dataObj.quantity]);
      const neworder = result.rows[0]; 
      connection.release();
      return neworder;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }


  async clearTestDb(): Promise<[]> {
    try {
      const connection = await client.connect();
      const result = await connection.query('DELETE FROM order_products');
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error: ${err}`)
    }
  }
}