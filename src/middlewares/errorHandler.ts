import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';

const errorToHttpMapping = {
  NotFoundError: httpCodes.NOT_FOUND,
  ExistError: httpCodes.BAD_REQUEST,
  InvalidCredentialsError: httpCodes.BAD_REQUEST,
  GroupMismatchError: httpCodes.BAD_REQUEST,
  ChangeError: httpCodes.BAD_REQUEST,
  DeleteError: httpCodes.BAD_REQUEST,
  ValidationFailed: httpCodes.BAD_REQUEST,
};

export async function errorHandler(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  try {
    await next();
  } catch (err) {
    const errorCode = errorToHttpMapping[err.constructor.name] | httpCodes.INTERNAL_SERVER_ERROR;
    ctx.response.status = errorCode;
    if (errorCode == httpCodes.INTERNAL_SERVER_ERROR) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${err}`);
      // eslint-disable-next-line no-console
      console.error(err);
      ctx.body = {
        message:
          'Internal server error happened. If problem persists, please contact administrators.',
      };
      return;
    }
    ctx.body = {
      errors: [err],
    };
  }
}
