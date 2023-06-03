import { Application, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ReturnedUserObj, User, UserTable } from '../models/user';

const userTable: UserTable = new UserTable();

/**
 * @description - function sends all users back to front end
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @returns {Promise<void>}
 */
const index = async (req: Request, res: Response): Promise<void> => {
  try {
    // verify passed jwt is authorized
    try {
      jwt.verify(req.params.token, process.env.TOKEN as Secret);
    } catch (error) {
      res.status(401);
      res.json('Unauthorized user.');
      return;
    }

    const allUsers: User[] = await userTable.index();
    res.json(allUsers);
  } catch (error) {
    res.send('An error has occured')
    throw new Error(`An error has occured: ${error}`);
  }
};

/**
 * @description - function creates a new user. generates a jsw to send to user for reference
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @returns {Promise<void>}
 */
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body) {
      res.send('No post request body found!');
      return;
    }

    // to see if chosen username already exists in db
    const existingUsers: User[] = await userTable.index();
    for (const existintingUser of existingUsers) {
      if (existintingUser.username === req.body.username) {
        res.json({error:`Username ${existintingUser.username} already exists, please choose another.`});
        return;
      }
    }
  
    // create payload to send to db
    const user: User = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      id: Math.floor(Math.random() * 10e6),
      password: bcrypt.hash(req.body.password, 10)
    };
    // create seperate payload for jwt
    const jwtUserPayload: User = {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username
    };

    const token: string = jwt.sign({user: jwtUserPayload}, process.env.TOKEN as Secret);
    const addedUser: User = await userTable.create({...user, token});

    if (!addedUser) {
      res.send(`User ${user.username} could not be created. Please retry.`);
      return;
    }

    const returnedUser: ReturnedUserObj = {
      user: addedUser,
      message: `Created new user ${addedUser.username}. Please save the returned token for future use.`
    };

    res.json(returnedUser);
  } catch (error) {
    res.send('An error has occured')
    throw new Error(`An error has occured: ${error}`);
  }
};

/**
 * @description - function that gets user data for a specific user based on username and a valid jwt
 * @param {Request} req - http request
 * @param {Response} res - http response
 * @returns {Promise<void>}
 */
const getUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body) {
      res.send('No post request body found!');
      return;
    }

    const userFromDb: User = await userTable.show(req.params.username);

    // verify passed jwt is authorized
    try {
      jwt.verify(req.params.token, process.env.TOKEN as Secret);
    } catch (error) {
      res.status(401);
      res.json('Unauthorized user.');
      return;
    }

    // create an object to return that doesnt show sensitive info
    const user: User = {
      firstname: userFromDb.firstname,
      lastname: userFromDb.lastname,
      username: userFromDb.username
    };
    res.json(user);
  } catch (error) {
    res.send('An error has occured.')
    throw new Error(`Error occured: ${error}.`);
  }
};

/**
 * @description - function that houses the http endpoints
 * @param {Application} app - the express app
 * @returns {void}
 */
const userRoutes = (app: Application): void => {
  app.post('/createUser', create);
  app.get('/getUserData/:username/:token', getUserData);
  app.get('/getAllUsers/:token', index);
};

export default userRoutes;