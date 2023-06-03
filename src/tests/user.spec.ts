import { UserTable } from '../models/user';

const userTable = new UserTable();
const mockUsersData = {
  preTestAndGlobalUsers: [
    {
      id: Math.floor(Math.random() * 10e6),
      firstname: 'Katherine',
      lastname: 'Janeway',
      username: 'CruisingDelta',
      password: 'janeway1153red'
    },
    {
      id: Math.floor(Math.random() * 10e6),
      firstname: 'Benjamin',
      lastname: 'Sikso',
      username: 'EmissaryDS9',
      password: 'siskoa471'
    }
  ],
  userInfoToCreate: {
    id: Math.floor(Math.random() * 10e6),
    firstname: 'Beverly',
    lastname: 'Crusher',
    username: 'BestDoctorInStarfleet',
    password: 'crusher22bc'
  },
};

// run test to add users to test db for testing
async function createUsers() {
  for (const user in mockUsersData.preTestAndGlobalUsers) {
    await userTable.create(mockUsersData.preTestAndGlobalUsers[user]);
  }
};
createUsers();

describe('User model', () => {
  it('should have an index method', () => {
    expect(userTable.index).toBeDefined();
  });
  
  it('should create a new user', async () => {
    mockUsersData.preTestAndGlobalUsers.push(mockUsersData.userInfoToCreate); // add to global array for other tests
    const result = await userTable.create(mockUsersData.userInfoToCreate);
    expect(result.token).toBeFalsy(); // since this test doesnt use userHandler.js, there will be no token assigned/coming from db
  });

  it('index method should return a list of users', async () => {
    const result = await userTable.index();
    result.forEach((user, i) => {
      // mock usernames should match usernames retrieved from db
      expect(user.firstname).toEqual(mockUsersData.preTestAndGlobalUsers[i].firstname);
    });
  });

  it('should show a users info when passing username', async () => {
    const result = await userTable.show(mockUsersData.preTestAndGlobalUsers[0].username);
    for (const info in result) {
      if (info !== 'token') { // since this test doesnt use userHandler.js, there will be no token assigned/coming from db
        expect(result[info as never]).toBeTruthy();
      } else {
        expect(result[info as never]).toBeFalsy();
      }
    }
    expect(result).toBeTruthy()
  });

  it('should have a clear all data method for testing and returns falsy', async () => {
    const result = await userTable.clearTestDb();
    expect(result).toBeFalsy();
  });
});
