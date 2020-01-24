import * as Koa from 'koa';
import * as dotenv from 'dotenv';
import * as bodyParser from 'koa-bodyparser';
import { DatabaseConnection, DatabaseConfiguration } from './db/connection';
import { router } from './routes';

dotenv.config();

const app = new Koa();

const dbConfig: DatabaseConfiguration = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
};

DatabaseConnection.initConnection(dbConfig);

app.use(bodyParser());
app.use(router.prefix('/api').routes());
app.listen(3000, () => console.log('Server started'));
