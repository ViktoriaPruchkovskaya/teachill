import Router = require('koa-router');
import { DatabaseConnection } from './db/connection';
import { sql } from 'slonik';

const router = new Router();

// use this logic as an example to create two controllers in indexController.ts
// TODO: remove this code and start use controllers instead of placing code in routes
// Routes should look like this: router.get("/specific/path/", specificPathListController);
router.get('/', async (ctx, next) => {
  const result = await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO users (username, password_hash, full_name) VALUES ('Vasil', '123145', 'Vasil')`
    );
    const res = await connection.any(sql`SELECT * FROM users`);
    return res;
  });
  ctx.body = { result };
  await next();
});

export { router };
