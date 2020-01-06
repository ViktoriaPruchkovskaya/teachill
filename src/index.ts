import * as Koa from 'koa';
import * as dotenv from 'dotenv';
import { DatabaseConnection } from './db/connection';
import { router } from './routes';

dotenv.config();

const app = new Koa();

// TODO: pass DatabaseConnection object as an argument and fill it with db credentaials from env in this file.
DatabaseConnection.initConnection();

app.use(router.routes());
app.listen(3000, () => console.log('Server started'));
