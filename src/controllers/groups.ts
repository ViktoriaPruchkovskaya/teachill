import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { GroupService } from '../services/groups';
import { Validator, shouldHaveField } from '../validations';
import { State } from '../state';
import { SyncBSUIR } from '../integrations/bsuir/sync';

interface GroupMemberData {
  userId: number;
}

interface GroupData {
  id: number;
  name: string;
}

export async function createGroup(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<GroupData>([shouldHaveField('name', 'string')]);
  const validatedData = validator.validate(ctx.request.body);

  const groupService = new GroupService();
  const groupId = await groupService.createGroup(validatedData.name);
  ctx.body = { groupId };
  ctx.response.status = httpCodes.CREATED;

  await next();
}

export async function getGroups(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const groupService = new GroupService();
  const groups = await groupService.getGroups();
  ctx.body = [...groups];
  await next();
}

export async function createGroupMember(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<GroupMemberData>([shouldHaveField('userId', 'number')]);
  const validatedData = validator.validate(ctx.request.body);

  const groupService = new GroupService();
  await groupService.createGroupMember(validatedData.userId, ctx.params.group_id);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;

  await next();
}

export async function getCurrentGroup(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const groupService = new GroupService();
  const currentGroup = await groupService.getCurrentGroup(ctx.state.user);

  ctx.body = { ...currentGroup };
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function getGroupMembers(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const groupService = new GroupService();
  const members = await groupService.getGroupMembers(ctx.params.group_id);
  ctx.body = [...members];
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function createSchedule(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const syncBSUIR = new SyncBSUIR();
  await syncBSUIR.createSchedule(ctx.params.group_id);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;

  await next();
}

export async function updateSchedule(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const syncBSUIR = new SyncBSUIR();

  await syncBSUIR.updateSchedule(ctx.state.user);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;

  await next();
}
