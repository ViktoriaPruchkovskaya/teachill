import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { SignupService, SigninService, RoleType, UserService } from '../services/users';
import {
  Validator,
  shouldHaveField,
  ValidationFailed,
  shouldMatchRegexp,
  minLengthShouldBe,
  valueShouldBeInEnum,
} from '../validations';
import { ExistError, NotFoundError, InvalidCredentialsError } from '../errors';
import { State } from '../state';

interface SignupData {
  username: string;
  password: string;
  fullName: string;
  role: number;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface RoleData {
  userId: number;
  roleId: number;
}

interface FullNameData {
  fullName: string;
}

export async function getUsers(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const userService = new UserService();
  const users = await userService.getUsers();
  ctx.response.status = httpCodes.OK;
  ctx.body = [...users];
  await next();
}

export async function signup(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: SignupData;
  const validator = new Validator<SignupData>([
    shouldHaveField('username', 'string'),
    shouldHaveField('password', 'string'),
    shouldHaveField('fullName', 'string'),
    shouldHaveField('role', 'number'),
    shouldMatchRegexp('username', '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'),
    minLengthShouldBe('password', 6),
    valueShouldBeInEnum('role', RoleType),
  ]);
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

  const signupService = new SignupService();
  try {
    const userId = await signupService.doSignup(
      validatedData.username,
      validatedData.password,
      validatedData.fullName,
      validatedData.role
    );
    ctx.body = { userId };
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

export async function signin(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const signinService = new SigninService();
  try {
    const authorize = await signinService.doSignin(
      ctx.request.body.username,
      ctx.request.body.password
    );
    ctx.body = { token: authorize };
    ctx.response.status = httpCodes.OK;
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }
  await next();
}

export async function changePassword(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  let validatedData: PasswordData;
  const validator = new Validator<PasswordData>([
    shouldHaveField('currentPassword', 'string'),
    shouldHaveField('newPassword', 'string'),
    minLengthShouldBe('currentPassword', 6),
    minLengthShouldBe('newPassword', 6),
  ]);
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

  const userService = new UserService();
  try {
    await userService.changePassword(
      ctx.state.username,
      validatedData.currentPassword,
      validatedData.newPassword
    );
    ctx.body = {};
    ctx.response.status = httpCodes.OK;
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return next();
    }
  }

  await next();
}

export async function changeRole(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  let validatedData: RoleData;
  const validator = new Validator<RoleData>([
    shouldHaveField('userId', 'number'),
    shouldHaveField('roleId', 'number'),
    valueShouldBeInEnum('roleId', RoleType),
  ]);
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

  if (ctx.state.user.id === validatedData.userId) {
    ctx.body = {
      error: 'Administrator cannot change his own role',
    };
    ctx.response.status = httpCodes.BAD_REQUEST;
    return next();
  }

  const userService = new UserService();
  try {
    await userService.changeRole(validatedData.userId, validatedData.roleId, ctx.params.group_id);
    ctx.body = {};
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

export async function changeFullName(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  let validatedData: FullNameData;
  const validator = new Validator<FullNameData>([shouldHaveField('fullName', 'string')]);

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

  const userService = new UserService();
  await userService.changeFullName(ctx.state.user.username, validatedData.fullName);
  ctx.body = {};
  ctx.response.status = httpCodes.OK;
  await next();
}

export async function currentUser(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const userService = new UserService();
  try {
    const user = await userService.getUserByUsername(ctx.state.username);
    ctx.body = { ...user };
    ctx.response.status = httpCodes.OK;
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return await next();
    }
  }

  await next();
}
