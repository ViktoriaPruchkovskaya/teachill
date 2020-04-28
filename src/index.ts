import * as Koa from 'koa';
import * as dotenv from 'dotenv';
import * as bodyParser from 'koa-bodyparser';
import * as koastatic from 'koa-static';
import * as mount from 'koa-mount';
import * as logger from 'koa-logger';
import { DatabaseConnection, DatabaseConfiguration } from './db/connection';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { LocalFileUploadService } from './services/upload';

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

app.use(logger());
app.use(bodyParser());
app.use(errorHandler);
app.use(mount('/uploads', koastatic(LocalFileUploadService.DEFAULT_UPLOAD_PATH)));
app.use(router.prefix('/api').routes());
app.listen(3000, () => console.log('[INFO] Server is ready to accept connections.'));
