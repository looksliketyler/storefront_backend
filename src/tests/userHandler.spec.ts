import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

import userRoutes from '../handlers/userHandler';
import { UserTable, User } from '../models/user';

const testDataPath = path.join(__dirname, '../../test_data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

const app = express();
app.use(bodyParser.json())
userRoutes(app);

const mockUserData = testData.userHandlerData.mockUserData;
let user: User;

describe('userHandler.js', () => {
  it('should have a userRoutes function', () => {
    expect(userRoutes).toBeDefined();
  });

  it('should create a new user', async () => {
    const response = await request(app).post('/createUser').send(mockUserData.postRequestBody);
    user = response.body.user;
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(mockUserData.successfulCreationMessage);
  });

  it('should get user data', async () => {
    const response = await request(app).get(`/getUserData/${user.username}/${user.token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({firstname: user.firstname, lastname: user.lastname, username: user.username});
    // last test for user table, so need to clear db
    // const userTable = new UserTable();
    // userTable.clearTestDb();
  });
});