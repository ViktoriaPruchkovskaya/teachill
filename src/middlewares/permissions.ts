import * as Koa from 'koa';
import { RoleType, UserService } from '../services/users';
import { State } from '../state';
import * as httpCodes from '../constants/httpCodes';

export function shouldHaveRole(roles: RoleType[]) {
  return async function(ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>, next: Koa.Next) {
    const userService = new UserService();
    const { role, id } = await userService.getUserByUsername(ctx.state.username);
    ctx.state.userId = id;

    if (!roles.find(requiredRole => requiredRole === role)) {
      return (ctx.response.status = httpCodes.FORBIDDEN);
    }
    await next();
  };
}
