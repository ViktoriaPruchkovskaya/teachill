import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';

const errorToHttpMapping = {
  NotFoundError: httpCodes.NOT_FOUND,
  ExistError: httpCodes.BAD_REQUEST,
  InvalidCredentialsError: httpCodes.BAD_REQUEST,
  GroupMismatchError: httpCodes.BAD_REQUEST,
  ChangeError: httpCodes.BAD_REQUEST,
  DeleteError: httpCodes.BAD_REQUEST,
};

export async function errorHandler(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  try {
    await next();
  } catch (err) {
    ctx.body = {
      errors: [err],
    };
    ctx.response.status =
      errorToHttpMapping[err.constructor.name] | httpCodes.INTERNAL_SERVER_ERROR;
  }
}
