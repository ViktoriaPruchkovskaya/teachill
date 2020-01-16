import * as Koa from 'koa';
import { sql } from 'slonik';
import * as httpCodes from '../constants/httpCodes';
import { DatabaseConnection } from '../db/connection';
import { SignupService, SigninService } from '../services/users';

export async function getUsers(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const users = await DatabaseConnection.getConnectionPool().connect(async connection => {
    const result = await connection.query(sql`SELECT username, full_name FROM users`);
    return result.rows;
  });
  ctx.body = { users };
  await next();
}

export async function signupController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  if (
    ctx.request.body.hasOwnProperty('username') &&
    ctx.request.body.hasOwnProperty('password') &&
    ctx.request.body.hasOwnProperty('fullName') &&
    ctx.request.body.username.replace(/\s/g, '').length >= 3 &&
    ctx.request.body.password.replace(/\s/g, '').length > 0 &&
    ctx.request.body.fullName.replace(/\s/g, '').length > 0 &&
    ctx.request.body.username.replace(/[!()-.?_~;:#&%$*+=@]/g, '').length > 0 &&
    /^[A-Za-z0-9!()-.?_~;:#&%$*+=@]/.test(ctx.request.body.username) &&
    ctx.request.body.username[0] !== '.' &&
    ctx.request.body.username[0] !== '-' &&
    ctx.request.body.password[0] !== '.' &&
    ctx.request.body.password[0] !== '-'
  ) {
    const signupService = new SignupService();

    const isUsernameNotExist = await signupService.doSignup(
      ctx.request.body.username,
      ctx.request.body.password,
      ctx.request.body.fullName
    );
    if (isUsernameNotExist) {
      ctx.body = {};
      ctx.response.status = httpCodes.CREATED;
    }
  }
  ctx.response.status = httpCodes.BAD_REQUEST;

  await next();
}

export async function signinController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const signinService = new SigninService();
  const authorize = await signinService.doSignin(
    ctx.request.body.username,
    ctx.request.body.password
  );
  if (authorize) {
    ctx.response.body = { token: authorize };
    ctx.response.status = httpCodes.OK;
  } else {
    ctx.response.status = httpCodes.BAD_REQUEST;
  }
  await next();
}
