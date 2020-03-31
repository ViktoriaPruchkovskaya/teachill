import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { NotFoundError } from '../errors';

function getHttpCode(error): number {
  switch (error.constructor) {
    case NotFoundError:
      return httpCodes.NOT_FOUND;
    default:
      return httpCodes.BAD_REQUEST;
  }
}

export async function errorHandler(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  try {
    await next();
  } catch (err) {
    ctx.body = {
      error: err.message,
    };
    ctx.response.status = getHttpCode(err);
  }
}
