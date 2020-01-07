import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export const addUser = async (ctx, next) => {
  await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(
      sql`INSERT INTO users (username, password_hash, full_name) VALUES (${ctx.body.username}, ${ctx.body.password}, ${ctx.body.fullName})`
    );
  });
  ctx.body = {};
  ctx.response.status = 201;
  await next();
};
