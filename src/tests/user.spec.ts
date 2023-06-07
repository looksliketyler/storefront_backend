import fs from 'fs';
import path from 'path';
import jwt, { Secret } from 'jsonwebtoken';

import { User, UserTable } from '../models/user';

const testDataPath = path.join(__dirname, '../../test_data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

const userTable = new UserTable();
const mockUsersData = testData.userModelData;
let token;

const generateToken = (user: User): Secret => {
  const jwtUserPayload: User = {
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username
  };    
  return jwt.sign({user: jwtUserPayload}, process.env.TOKEN as Secret);
};

// run test to add users to test db for testing
async function createUsers() {
  for (const user in mockUsersData.preTestAndGlobalUsers) {
    mockUsersData.preTestAndGlobalUsers[user].token = generateToken(mockUsersData.preTestAndGlobalUsers[user])
    await userTable.create(mockUsersData.preTestAndGlobalUsers[user]);
  }
};
createUsers();


describe('User model', () => {
  it('should have an index method', () => {
    expect(userTable.index).toBeDefined();
  });
  
  it('should create a new user', async () => {
    const user = mockUsersData.userInfoToCreate;
    user.token = generateToken(user);
    mockUsersData.preTestAndGlobalUsers.push(mockUsersData.userInfoToCreate); // add to global array for other tests
    const result = await userTable.create(mockUsersData.userInfoToCreate);
    const newUser = mockUsersData.userInfoCreated;
    newUser.token = user.token;
    expect(result).toEqual(newUser)
  });

  it('index method should return a list of users', async () => {
    const result = await userTable.index();
    // @ts-ignore
    result.sort((a, b) => a.id - b.id);
    // @ts-ignore
    mockUsersData.preTestAndGlobalUsers.sort((a, b) => a.id - b.id);
    result.forEach((user, i) => {
      // mock usernames should match usernames retrieved from db
      expect(user.firstname).toEqual(mockUsersData.preTestAndGlobalUsers[i].firstname);
    });
  });

  it('should show a users info when passing username', async () => {
    const result = await userTable.show(mockUsersData.preTestAndGlobalUsers[0].username);
    expect(result).toEqual(mockUsersData.preTestAndGlobalUsers[0]);
  });
});
