import client from '../database';

export type Product = {
  name: string;
  price: string;
  id: number;
};

export class ProductTable {

  /**
   * @description - calls database to select all info from products table
   * @returns {Promise<Product[]>} - array of Products
   */
  public async index(): Promise<Product[]> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * from products';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  /**
   * @description - calls database to grab a single product
   * @param {string} id - passed product id to show
   * @returns {Promise<Product>} a single product
   */
  async show(id: string): Promise<Product> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    }
  }

  /**
   * @description - adds a new product to database
   * @param {Product} product - the product in which to add to database
   * @returns {Promise<Product>} - the product thats been added
   */
  async create(product: Product): Promise<Product> {
    try {
      const connection = await client.connect();
      const sql = 'INSERT INTO products (name, price, id) VALUES($1, $2, $3) RETURNING *';
      const result = await connection.query(sql, [product.name, product.price, product.id]);
      const newProduct = result.rows[0]; 
      connection.release();
      return newProduct;
    } catch (err) {
      throw new Error(`Could not add new product ${product.name}. Error: ${err}`);
    }
  }

  /**
   * @description - method to clear db table
   * @returns {Promise<[]>}
   */
  async clearTestDb(): Promise<[]> {
    try {
      const connection = await client.connect();
      const result = await connection.query('DELETE FROM products');
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error: ${err}`)
    }
  }
}