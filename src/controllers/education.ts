import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { GroupService } from '../services/education';

export async function createGroupController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const groupService = new GroupService();

  let groupId: number;
  try {
    groupId = await groupService.createGroup(ctx.request.body.id, ctx.request.body.name);
  } catch (err) {
    ctx.body = err.message;
    ctx.response.status = httpCodes.BAD_REQUEST;
    return await next();
  }

  ctx.body = { groupId };
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function getGroupsController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const groupService = new GroupService();
  const groups = await groupService.getGroups();
  ctx.body = { groups };
  await next();
}

export async function createGroupMemberController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const groupService = new GroupService();
  try {
    await groupService.createGroupMember(ctx.request.body.userId, ctx.params.group_id);
  } catch (err) {
    ctx.body = err.message;
    ctx.response.status = httpCodes.BAD_REQUEST;
    return await next();
  }

  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function getGroupMembersController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const groupService = new GroupService();
  const members = await groupService.getGroupMembers(ctx.params.group_id);
  ctx.body = members;
  ctx.response.status = httpCodes.OK;
  await next();
}
