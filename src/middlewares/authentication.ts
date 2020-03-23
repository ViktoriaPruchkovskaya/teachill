import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { JWTService, JWTAuthError } from '../services/jwt';
import { UserService } from '../services/users';
import { State } from '../state';

export async function authMiddleware(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  let token = ctx.request.headers['authorization'];
  if (!token) {
    return (ctx.response.status = httpCodes.UNAUTHORIZED);
  } else {
    token = token.replace(/^Bearer\s/, '');
    try {
      const jwtService = new JWTService();
      const userService = new UserService();

      const { username } = jwtService.verify(token);
      ctx.state.user = await userService.getUserByUsername(username);
    } catch (err) {
      if (err instanceof JWTAuthError) {
        ctx.response.status = httpCodes.UNAUTHORIZED;
        return;
      }
      ctx.response.status = httpCodes.SERVER_ERROR;
    }
    await next();
  }
}
