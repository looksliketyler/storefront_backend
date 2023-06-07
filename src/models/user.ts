import { Secret } from 'jsonwebtoken';

import client from '../database';

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  password?: Promise<string> | string;
  token?: Secret | string;
};

export interface ReturnedUserObj {
  user: User;
  message: string;
};

export class UserTable {

  /**
   * @description - calls database to select all info from users table
   * @returns {Promise<User[]>} - array of users
   */
  async index(): Promise<User[]> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * from users';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
  
  /**
   * @description - calls database to grab a single user
   * @param {string} username - passed username to show
   * @returns {Promise<User>} a single user
   */
  async show(username: string): Promise<User> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM users WHERE username=($1)';
      const result = await connection.query(sql, [username]);
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${username}. Error: ${err}`)
    }
  }

  /**
   * @description - adds a new user to database
   * @param {User} user - the user in which to add to database
   * @returns {Promise<User>} - the user thats been added
   */
  async create(user: User): Promise<User> {
    try {
      const connection = await client.connect();
      const sql = 'INSERT INTO users (firstname, lastname, username, id, password, token) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
      const result = await connection.query(sql, [user.firstname, user.lastname, user.username, user.id, user.password, user.token]);
      const newUser = result.rows[0]; 
      connection.release();
      const userToReturn = {
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        username: newUser.username,
        token: newUser.token,
        userId: newUser.id
      };
      return userToReturn;
    } catch (err) {
      throw new Error(`Could not add new user ${user.id}. Error: ${err}`);
    }
  }

  /**
   * @description - method for clearing db table
   * @returns {Promise<[]>}
   */
  async clearTestDb(): Promise<[]> {
    try {
      const connection = await client.connect();
      const result = await connection.query('DELETE FROM users');
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`error: ${err}`)
    }
  }
}
