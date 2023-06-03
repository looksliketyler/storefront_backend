import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import userRoutes from '../handlers/userHandler';
import { UserTable } from '../models/user';

const app = express();
app.use(bodyParser.json())
userRoutes(app);

const mockUserData = {
  postRequestBody: {
    firstname: 'Jean-Luc',
    lastname: 'Picard',
    username: 'BestEnterpriseCaptain1701',
    password: 'picard47'
  },
  successfulCreationMessage: 'Created new user BestEnterpriseCaptain1701. Please save the returned token for future use.'
};

describe('userHandler.js', () => {
  it('should have a userRoutes function', () => {
    expect(userRoutes).toBeDefined();
  });

  it('should create a new user', async () => {
    const response = await request(app).post('/createUser').send(mockUserData.postRequestBody);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(mockUserData.successfulCreationMessage);
  });

  it('should get response of unauthorized user since not passing token', async () => {
    const response = await request(app).get('/getUserData/BestEnterpriseCaptain1701/1');
    expect(response.status).toBe(401);
    expect(response.body).toEqual('Unauthorized user.');
    // last test for user table, so need to clear db
    const userTable = new UserTable();
    userTable.clearTestDb();
  });
});