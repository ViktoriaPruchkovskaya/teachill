import * as Koa from 'koa';
import { sql } from 'slonik';
import * as httpCodes from '../constants/httpCodes';
import { DatabaseConnection } from '../db/connection';
import { SignupService, SigninService, RoleType } from '../services/users';
import {
  Validator,
  shouldHaveField,
  ValidationFailed,
  shouldMatchRegexp,
  minLengthShouldBe,
  valueShouldBeInEnum,
} from '../validations';
import { ExistError } from '../errors';

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
  role: number;
}

export async function signupController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: SignupData;
  const validator = new Validator<SignupData>([
    shouldHaveField('username', 'string'),
    shouldHaveField('password', 'string'),
    shouldHaveField('fullName', 'string'),
    shouldHaveField('role', 'number'),
    shouldMatchRegexp('username', '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'),
    minLengthShouldBe('password', 6),
    valueShouldBeInEnum('role', RoleType),
  ]);
  try {
    validatedData = validator.validate(ctx.request.body);
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

  let userId: number;
  try {
    userId = await signupService.doSignup(
      validatedData.username,
      validatedData.password,
      validatedData.fullName,
      validatedData.role
    );
  } catch (err) {
    if (err instanceof ExistError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }

  ctx.body = { userId };
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function signinController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const signinService = new SigninService();
  const authorize = await signinService.doSignin(
    ctx.request.body.username,
    ctx.request.body.password
  );
  if (!authorize) {
    ctx.response.status = httpCodes.BAD_REQUEST;
    return await next();
  }
  ctx.body = { token: authorize };
  ctx.response.status = httpCodes.OK;
  await next();
}
