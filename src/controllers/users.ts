import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { SignupService, SigninService, RoleType, UserService } from '../services/users';
import {
  Validator,
  shouldHaveField,
  shouldMatchRegexp,
  minLengthShouldBe,
  valueShouldBeInEnum,
  mayHaveFields,
  optionalFieldShouldHaveType,
} from '../validations';
import { State } from '../state';

interface SignupData {
  username: string;
  password: string;
  fullName: string;
  role: number;
}

interface SigninData {
  username: string;
  password: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface RoleData {
  roleId: number;
}

interface UserData {
  fullName?: string;
}

export async function getUsers(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const userService = new UserService();
  const users = await userService.getUsers();
  ctx.response.status = httpCodes.OK;
  ctx.body = [...users];
  await next();
}

export async function signup(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<SignupData>([
    shouldHaveField('username', 'string'),
    shouldHaveField('password', 'string'),
    shouldHaveField('fullName', 'string'),
    shouldHaveField('role', 'number'),
    shouldMatchRegexp('username', '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'),
    minLengthShouldBe('password', 6),
    valueShouldBeInEnum('role', RoleType),
  ]);

  const validatedData = validator.validate(ctx.request.body);

  const signupService = new SignupService();
  const userId = await signupService.doSignup(validatedData);
  ctx.body = { userId };
  ctx.response.status = httpCodes.CREATED;

  await next();
}

export async function signin(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<SigninData>([
    shouldHaveField('username', 'string'),
    shouldHaveField('password', 'string'),
  ]);

  const validatedData = validator.validate(ctx.request.body);

  const signinService = new SigninService();

  const authorize = await signinService.doSignin(validatedData.username, validatedData.password);
  ctx.body = { token: authorize };
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function changePassword(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const validator = new Validator<PasswordData>([
    shouldHaveField('currentPassword', 'string'),
    shouldHaveField('newPassword', 'string'),
    minLengthShouldBe('currentPassword', 6),
    minLengthShouldBe('newPassword', 6),
  ]);

  const validatedData = validator.validate(ctx.request.body);

  const userService = new UserService();
  await userService.changePassword(
    ctx.state.user.username,
    validatedData.currentPassword,
    validatedData.newPassword
  );
  ctx.body = {};
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function changeRole(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const validator = new Validator<RoleData>([
    shouldHaveField('roleId', 'number'),
    valueShouldBeInEnum('roleId', RoleType),
  ]);
  const validatedData = validator.validate(ctx.request.body);

  const userService = new UserService();
  await userService.changeRole(ctx.state.user, ctx.params.user_id, validatedData.roleId);
  ctx.body = {};
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function updateUser(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const validator = new Validator<UserData>([
    mayHaveFields(['fullName']),
    optionalFieldShouldHaveType('fullName', 'string'),
  ]);
  const validatedData = validator.validate(ctx.request.body);

  const userService = new UserService();
  await userService.updateUser(ctx.state.user.username, validatedData);
  ctx.body = {};
  ctx.response.status = httpCodes.OK;
  await next();
}

export async function currentUser(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const userService = new UserService();
  const user = await userService.getUserByUsername(ctx.state.user.username);
  ctx.body = { ...user };
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function deleteUser(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const userService = new UserService();
  await userService.deleteUserById(ctx.state.user, ctx.params.user_id);
  ctx.body = {};
  ctx.response.status = httpCodes.OK;

  await next();
}
