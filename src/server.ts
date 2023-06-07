import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './handlers/userHandler';
import orderRoutes from './handlers/orderHandler';
import productRoutes from './handlers/productHandler';

const app: Application = express();
const address: string = "0.0.0.0:3000";
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://someotherdomain.com',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/', function (_req: Request, res: Response) {
  res.send('Hello World!');
});

orderRoutes(app);
userRoutes(app);
productRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
