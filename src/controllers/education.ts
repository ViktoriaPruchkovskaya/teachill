import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { GroupService } from '../services/education';

export async function createGroupController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const groupService = new GroupService();
  const groupId = await groupService.createGroup(ctx.request.body.id, ctx.request.body.name);
  ctx.body = { groupId };
  ctx.response.status = httpCodes.CREATED;
  await next();
}
