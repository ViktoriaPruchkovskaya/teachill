import * as Koa from 'koa';
import * as jwt from 'jsonwebtoken';
import * as httpCodes from '../constants/httpCodes';

export async function authMiddleware(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let token = ctx.request.headers['authorization'];
  if (!token) {
    return (ctx.response.status = httpCodes.UNAUTHORIZED);
  } else {
    token = token.replace(/^Bearer\s/, '');
    try {
      jwt.verify(token, 'secretKey');
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        ctx.response.status = httpCodes.UNAUTHORIZED;
      }
      ctx.response.status = httpCodes.BAD_REQUEST;
    }
    await next();
  }
}
