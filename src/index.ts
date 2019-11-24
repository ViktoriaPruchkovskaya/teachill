import * as Koa from 'koa';
import * as Router from 'koa-router';
import { createPool, sql } from 'slonik';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new Koa();
const router = new Router();

router.get('/', async (ctx, next) => {
  const pool = createPool(
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`
  );

  const result = await pool.connect(async connection => {
    const res = await connection.query(sql`
    SELECT first_name, last_name
    FROM users
    `);
    return res.rows;
  });
  ctx.body = { result };
  await next();
});

app.use(router.routes());
app.listen(3000, () => console.log('Server started'));
