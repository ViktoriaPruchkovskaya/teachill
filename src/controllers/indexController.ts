import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

export const getUsers = async (ctx, next) => {
  const users = await DatabaseConnection.getConnectionPool().connect(async connection => {
    const result = await connection.query(sql`SELECT username, full_name FROM users`);
    return result.rows;
  });
  ctx.body = { users };
  await next();
};

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
