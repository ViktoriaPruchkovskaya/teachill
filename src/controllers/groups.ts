import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { GroupService } from '../services/groups';
import { Validator, shouldHaveField, ValidationFailed } from '../validations';
import { ExistError, NotFoundError } from '../errors';
import { State } from '../state';

interface GroupMemberData {
  userId: number;
}

interface GroupData {
  id: number;
  name: string;
}

export async function createGroup(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: GroupData;
  const validator = new Validator<GroupData>([shouldHaveField('name', 'string')]);
  try {
    validatedData = validator.validate(ctx.request.body);
  } catch (err) {
    if (err instanceof ValidationFailed) {
      ctx.body = {
        errors: err.errors,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return next();
    }
  }

  const groupService = new GroupService();
  try {
    const groupId = await groupService.createGroup(validatedData.name);
    ctx.body = { groupId };
    ctx.response.status = httpCodes.CREATED;
  } catch (err) {
    if (err instanceof ExistError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return next();
    }
  }

  await next();
}

export async function getGroups(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const groupService = new GroupService();
  const groups = await groupService.getGroups();
  ctx.body = [...groups];
  await next();
}

export async function createGroupMember(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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
      return next();
    }
  }

  const groupService = new GroupService();
  try {
    await groupService.createGroupMember(validatedData.userId, ctx.params.group_id);
    ctx.body = {};
    ctx.response.status = httpCodes.CREATED;
  } catch (err) {
    if (err instanceof ExistError || err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return next();
    }
  }

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
  try {
    const members = await groupService.getGroupMembers(ctx.params.group_id);
    ctx.body = [...members];
    ctx.response.status = httpCodes.OK;
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return next();
    }
  }

  await next();
}
