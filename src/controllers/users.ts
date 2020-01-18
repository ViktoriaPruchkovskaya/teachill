import * as Koa from 'koa';
import { sql } from 'slonik';
import * as httpCodes from '../constants/httpCodes';
import { DatabaseConnection } from '../db/connection';
import { SignupService, SigninService } from '../services/users';
import { Validator, shouldHaveField, ValidationFailed, shouldMatchRegexp } from '../validations';

export async function getUsers(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const users = await DatabaseConnection.getConnectionPool().connect(async connection => {
    const result = await connection.query(sql`SELECT username, full_name FROM users`);
    return result.rows;
  });
  ctx.body = { users };
  await next();
}

interface SignupData {
  username: string;
  password: string;
  fullName: string;
}

export async function signupController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<SignupData>([
    shouldHaveField('username', 'string'),
    shouldHaveField('password', 'string'),
    shouldHaveField('fullName', 'string'),
    shouldMatchRegexp('username', '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'),
  ]);
  try {
    validator.validate(ctx.request.body);
  } catch (err) {
    if (err instanceof ValidationFailed) {
      ctx.body = {
        errors: err.errors,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }

  const signupService = new SignupService();
  const isUsernameNotExist = await signupService.doSignup(
    ctx.request.body.username,
    ctx.request.body.password,
    ctx.request.body.fullName
  );
  if (isUsernameNotExist) {
    ctx.body = {};
    ctx.response.status = httpCodes.CREATED;
    return await next();
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
