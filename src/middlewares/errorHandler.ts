import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { InternalServerError } from '../errors';
import { errorLogger } from './errorLog';

const errorToHttpMapping = {
  NotFoundError: httpCodes.NOT_FOUND,
  ExistError: httpCodes.BAD_REQUEST,
  InvalidCredentialsError: httpCodes.BAD_REQUEST,
  GroupMismatchError: httpCodes.BAD_REQUEST,
  ChangeError: httpCodes.BAD_REQUEST,
  DeleteError: httpCodes.BAD_REQUEST,
  ValidationFailed: httpCodes.BAD_REQUEST,
};

export async function errorHandler(ctx: Koa.ParameterizedContext, next: Koa.Next): Promise<void> {
  try {
    await next();
  } catch (err) {
    const errorCode = errorToHttpMapping[err.constructor.name] || httpCodes.INTERNAL_SERVER_ERROR;
    ctx.response.status = errorCode;
    if (errorCode == httpCodes.INTERNAL_SERVER_ERROR) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${err}`);
      // eslint-disable-next-line no-console
      console.error(err);
      ctx.body = {
        errors: [new InternalServerError()],
      };

      await errorLogger(ctx, err);

      return;
    }
    ctx.body = {
      errors: [err],
    };
  }
}
