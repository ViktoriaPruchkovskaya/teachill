import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { GroupService } from '../services/groups';
import { Validator, shouldHaveField, ValidationFailed } from '../validations';

interface GroupMemberData {
  userId: number;
}

interface GroupData {
  id: number;
  name: string;
}

export async function createGroupController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: GroupData;
  const validator = new Validator<GroupData>([
    shouldHaveField('id', 'number'),
    shouldHaveField('name', 'string'),
  ]);
  try {
    validatedData = validator.validate(ctx.request.body);
  } catch (err) {
    if (err instanceof ValidationFailed) {
      ctx.body = {
        errors: err.errors,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }

  const groupService = new GroupService();

  let groupId: number;
  try {
    groupId = await groupService.createGroup(validatedData.id, validatedData.name);
  } catch (err) {
    ctx.body = {
      error: err.message,
    };
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
  ctx.body = [...groups];
  await next();
}

export async function createGroupMemberController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: GroupMemberData;
  const validator = new Validator<GroupMemberData>([shouldHaveField('userId', 'number')]);
  try {
    validatedData = validator.validate(ctx.request.body);
  } catch (err) {
    if (err instanceof ValidationFailed) {
      ctx.body = {
        errors: err.errors,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }

  const groupService = new GroupService();
  try {
    await groupService.createGroupMember(validatedData.userId, ctx.params.group_id);
  } catch (err) {
    if (err instanceof ValidationFailed) {
      ctx.body = {
        error: err.message,
      };
    }
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
  ctx.body = [...members];
  ctx.response.status = httpCodes.OK;
  await next();
}
