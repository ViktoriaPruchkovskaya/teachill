import * as Koa from 'koa';
import { RoleType } from '../services/users';
import { State } from '../state';
import { FORBIDDEN } from '../constants/httpCodes';

export function shouldHaveRole(roles: RoleType[]) {
  return async function(ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>, next: Koa.Next) {
    if (!roles.includes(ctx.state.user.role)) {
      ctx.body = {
        error: 'You have no permissions to perform this action.',
      };
      ctx.response.status = FORBIDDEN;
      return;
    }
    await next();
  };
}
