import * as Koa from 'koa';
import * as jwt from 'jsonwebtoken';
import * as httpCodes from '../constants/httpCodes';

export function authMiddleware(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const token = ctx.request.headers['authorization'].replace(/^Bearer\s/, '');
  if (!token) {
    ctx.response.status = httpCodes.UNAUTHORIZED;
  }
  try {
    jwt.verify(token, 'secretKey');
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      ctx.response.status = httpCodes.UNAUTHORIZED;
    }
    ctx.response.status = httpCodes.BAD_REQUEST;
  }
  next();
}
