import { SignupService, SigninService, UserService, RoleType } from '../services/users';
import { PasswordService } from '../services/password';
import { JWTService } from '../services/jwt';
import { GroupService } from '../services/groups';
import * as usersRepository from '../repositories/users';
import * as userMocks from './mocks/users';
import * as passwordMock from './mocks/password';
import { getToken } from './mocks/jwt';
import { getGroupMembersMethod } from './mocks/groups';

const mockedUsers = usersRepository as jest.Mocked<typeof usersRepository>;

describe('test signup service', () => {
  it('test user signup', async () => {
    const USER = {
      username: 'petrov',
      password: '1234password',
      fullName: 'Petrov A.A.',
      role: 1,
    };
    const signupService = new SignupService();
    (signupService as any).passwordService = new PasswordService();
    mockedUsers.getUserByUsername = userMocks.getNonexistentUserByUsername();
    (signupService as any).passwordService.hashPassword = passwordMock.hashPassword();
    mockedUsers.createUser = userMocks.createUser();
    (signupService as any).createUserRole = userMocks.createUserRole();

    const id = await signupService.doSignup(USER);

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect((signupService as any).passwordService.hashPassword).toBeCalledTimes(1);
    expect(mockedUsers.createUser).toBeCalledTimes(1);
    expect((signupService as any).createUserRole).toBeCalledTimes(1);
    expect(await mockedUsers.getUserByUsername(USER.username)).toBeNull();
    expect(await (signupService as any).passwordService.hashPassword(USER.password)).toBe(
      `2134${USER.password}`
    );
    expect(id).toBe(1);
  });

  it('test user signup with username that already exists', async () => {
    const USER = {
      username: 'petrov',
      password: '1234password',
      fullName: 'Petrov A.A.',
      role: 1,
    };
    const signupService = new SignupService();
    (signupService as any).passwordService = new PasswordService();
    mockedUsers.getUserByUsername = userMocks.getUserByUsername();
    (signupService as any).passwordService.hashPassword = passwordMock.hashPassword();
    mockedUsers.createUser = userMocks.createUser();
    (signupService as any).createUserRole = userMocks.createUserRole();

    await expect(signupService.doSignup(USER)).rejects.toThrow('Username already exists');

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect((signupService as any).passwordService.hashPassword).not.toBeCalled();
    expect(mockedUsers.createUser).not.toBeCalled();
    expect((signupService as any).createUserRole).not.toBeCalled();
    expect((await mockedUsers.getUserByUsername(USER.username)).username).toBe(USER.username);
  });
});

describe('test signin service', () => {
  it('test user signin', async () => {
    const USERNAME = 'petrov';
    const PASSWORD = 'password';
    delete process.env.SECRET_KEY;
    process.env.SECRET_KEY = 'secretKey';
    const signinService = new SigninService();
    (signinService as any).passwordService = new PasswordService();
    (signinService as any).jwtService = new JWTService();
    mockedUsers.getUserByUsername = userMocks.getUserByUsername();
    (signinService as any).passwordService.comparePasswords = passwordMock.comparePasswords();
    (signinService as any).jwtService.getToken = getToken();

    const signin = await signinService.doSignin(USERNAME, PASSWORD);

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect((signinService as any).passwordService.comparePasswords).toBeCalledTimes(1);
    expect((signinService as any).jwtService.getToken).toBeCalledTimes(1);
    expect((await mockedUsers.getUserByUsername(USERNAME)).username).toBe(USERNAME);
    expect(
      await (signinService as any).passwordService.comparePasswords(
        PASSWORD,
        (await mockedUsers.getUserByUsername(USERNAME)).passwordHash
      )
    ).toBeTruthy();
    expect(signin).toBe('token');
  });

  it('test user signin without JWT secret key', async () => {
    delete process.env.SECRET_KEY;
    expect(() => new SigninService()).toThrow('Secret key is missing');
  });

  it('test user signin with incorrect username', async () => {
    const USERNAME = 'petrov';
    const PASSWORD = 'password';
    delete process.env.SECRET_KEY;
    process.env.SECRET_KEY = 'secretKey';
    const signinService = new SigninService();

    (signinService as any).passwordService = new PasswordService();
    (signinService as any).jwtService = new JWTService();
    mockedUsers.getUserByUsername = userMocks.getNonexistentUserByUsername();
    (signinService as any).passwordService.comparePasswords = passwordMock.comparePasswords();
    (signinService as any).jwtService.getToken = getToken();

    await expect(signinService.doSignin(USERNAME, PASSWORD)).rejects.toThrow(
      'Username is incorrect'
    );

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect((signinService as any).passwordService.comparePasswords).not.toBeCalled();
    expect((signinService as any).jwtService.getToken).not.toBeCalled();
    expect(await mockedUsers.getUserByUsername(USERNAME)).toBeNull();
    delete process.env.SECRET_KEY;
  });

  it('test user signin with incorrect password', async () => {
    const USERNAME = 'petrov';
    const PASSWORD = 'incorrectPassword';
    delete process.env.SECRET_KEY;
    process.env.SECRET_KEY = 'secretKey';
    const signinService = new SigninService();
    (signinService as any).passwordService = new PasswordService();
    (signinService as any).jwtService = new JWTService();
    mockedUsers.getUserByUsername = userMocks.getUserByUsername();
    (signinService as any).passwordService.comparePasswords = passwordMock.comparePasswords();
    (signinService as any).jwtService.getToken = getToken();

    await expect(signinService.doSignin(USERNAME, PASSWORD)).rejects.toThrow(
      'Password is incorrect'
    );

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect((signinService as any).passwordService.comparePasswords).toBeCalledTimes(1);
    expect((signinService as any).jwtService.getToken).not.toBeCalled();
    expect((await mockedUsers.getUserByUsername(USERNAME)).username).toBe(USERNAME);
    expect(
      await (signinService as any).passwordService.comparePasswords(
        PASSWORD,
        (await mockedUsers.getUserByUsername(USERNAME)).passwordHash
      )
    ).toBeFalsy();
  });
});

describe('test user service', () => {
  it('test getting users', async () => {
    const userService = new UserService();
    mockedUsers.getUsers = userMocks.getUsers();

    const users = await userService.getUsers();

    expect(mockedUsers.getUsers).toBeCalledTimes(1);
    expect(users).toEqual([
      { id: 1, username: 'user1', fullName: 'user', role: RoleType.Administrator },
      { id: 2, username: 'user2', fullName: 'user user', role: RoleType.Administrator },
    ]);
  });

  it('test getting empty users list', async () => {
    const userService = new UserService();
    mockedUsers.getUsers = userMocks.getEmptyUsersArray();

    const users = await userService.getUsers();

    expect(mockedUsers.getUsers).toBeCalledTimes(1);
    expect(users).toEqual([]);
  });

  it('test changing user password', async () => {
    const USERNAME = 'user';
    const CURRENT_PASSWORD = 'password';
    const NEW_PASSWORD = '654321';
    const userService = new UserService();
    (userService as any).passwordService = new PasswordService();
    mockedUsers.getUserByUsername = userMocks.getUserByUsername();
    mockedUsers.changePassword = userMocks.changePassword();
    (userService as any).passwordService.comparePasswords = passwordMock.comparePasswords();
    (userService as any).passwordService.hashPassword = passwordMock.hashPassword();

    await userService.changePassword(USERNAME, CURRENT_PASSWORD, NEW_PASSWORD);

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect(mockedUsers.changePassword).toBeCalledTimes(1);
    expect((userService as any).passwordService.comparePasswords).toBeCalledTimes(1);
    expect((userService as any).passwordService.hashPassword).toBeCalledTimes(1);
    expect((await mockedUsers.getUserByUsername(USERNAME)).username).toBe(USERNAME);
    expect(
      await (userService as any).passwordService.comparePasswords(
        CURRENT_PASSWORD,
        (await mockedUsers.getUserByUsername(USERNAME)).passwordHash
      )
    ).toBeTruthy();
    expect(await (userService as any).passwordService.hashPassword(NEW_PASSWORD)).toEqual(
      `2134${NEW_PASSWORD}`
    );
  });

  it('test changing users password with incorrect current password', async () => {
    const USERNAME = 'user';
    const CURRENT_PASSWORD = 'incorrectPassword';
    const NEW_PASSWORD = '654321';
    const userService = new UserService();
    (userService as any).passwordService = new PasswordService();
    mockedUsers.getUserByUsername = userMocks.getUserByUsername();
    mockedUsers.changePassword = userMocks.changePassword();
    (userService as any).passwordService.comparePasswords = passwordMock.comparePasswords();
    (userService as any).passwordService.hashPassword = passwordMock.hashPassword();

    await expect(
      userService.changePassword(USERNAME, CURRENT_PASSWORD, NEW_PASSWORD)
    ).rejects.toThrow('Current password is incorrect');

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect(mockedUsers.changePassword).not.toBeCalled();
    expect((userService as any).passwordService.comparePasswords).toBeCalledTimes(1);
    expect((userService as any).passwordService.hashPassword).not.toBeCalled();
    expect((await mockedUsers.getUserByUsername(USERNAME)).username).toBe(USERNAME);
    expect(
      await (userService as any).passwordService.comparePasswords(
        CURRENT_PASSWORD,
        (await mockedUsers.getUserByUsername(USERNAME)).passwordHash
      )
    ).toBeFalsy();
  });

  it('test changing user role', async () => {
    const TARGET_USER_ID = 2;
    const TARGER_USER_GROUP = 2;
    const ROLE_TYPE = 1;
    const USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const USER_GROUP = 2;
    const userService = new UserService();
    (userService as any).getGroupIfCommon = userMocks.getGroupIfCommon(
      USER_GROUP,
      TARGER_USER_GROUP
    );
    mockedUsers.changeRole = userMocks.createUserRole();

    await userService.changeRole(USER, TARGET_USER_ID, ROLE_TYPE);
    expect((userService as any).getGroupIfCommon).toBeCalledTimes(1);
    expect(mockedUsers.changeRole).toBeCalledTimes(1);
    expect(await (userService as any).getGroupIfCommon(USER.id, TARGET_USER_ID)).toBe(2);
  });

  it('test changing user role with membership in another group or group does not exist', async () => {
    const TARGET_USER_ID = 2;
    const TARGET_USER_GROUP = 1;
    const USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const USER_GROUP = 2;
    const userService = new UserService();
    (userService as any).getGroupIfCommon = userMocks.getGroupIfCommon(
      USER_GROUP,
      TARGET_USER_GROUP
    );

    expect(() => (userService as any).getGroupIfCommon(USER.id, TARGET_USER_ID)).toThrow(
      'Groups do not match'
    );

    expect((userService as any).getGroupIfCommon).toBeCalledTimes(1);
  });

  it('test update user', async () => {
    const USERNAME = 'petrov';
    const UPDATE_INFO = {
      fullName: 'newFullName',
    };
    const userService = new UserService();
    mockedUsers.updateUser = userMocks.updateUser();

    await userService.updateUser(USERNAME, UPDATE_INFO);

    expect(mockedUsers.updateUser).toBeCalledTimes(1);
  });

  it('test getting user by username', async () => {
    const USERNAME = 'user';
    const userService = new UserService();
    mockedUsers.getUserByUsername = userMocks.getUserByUsername();

    const user = await userService.getUserByUsername(USERNAME);

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect(user.username).toBe(USERNAME);
  });

  it('test getting user by nonexistent username', async () => {
    const USERNAME = 'user';
    const userService = new UserService();
    mockedUsers.getUserByUsername = userMocks.getNonexistentUserByUsername();

    await expect(userService.getUserByUsername(USERNAME)).rejects.toThrow('User does not exist');

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect(await mockedUsers.getUserByUsername(USERNAME)).toBeNull();
  });

  it('test user removing', async () => {
    const TARGET_USER_ID = 2;
    const TARGET_USER_GROUP = 2;
    const USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const USER_GROUP = 2;
    const userService = new UserService();
    (userService as any).groupService = new GroupService();
    (userService as any).getGroupIfCommon = userMocks.getGroupIfCommon(
      USER_GROUP,
      TARGET_USER_GROUP
    );
    (userService as any).groupService.getGroupMembers = getGroupMembersMethod();
    mockedUsers.deleteById = userMocks.deleteById();

    await userService.deleteUserById(USER, TARGET_USER_ID);

    expect((userService as any).getGroupIfCommon).toBeCalledTimes(1);
    expect(mockedUsers.deleteById).toBeCalledTimes(1);
    expect((userService as any).groupService.getGroupMembers).toBeCalledTimes(1);
    expect(await (userService as any).getGroupIfCommon(USER.id, TARGET_USER_ID)).toBe(2);
  });

  it('test user from nonexistent group wants to delete another user', async () => {
    const TARGET_USER_ID = 2;
    const TARGET_USER_GROUP = 2;
    const USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const USER_GROUP = 9;
    const userService = new UserService();
    (userService as any).getGroupIfCommon = userMocks.getGroupIfCommon(
      USER_GROUP,
      TARGET_USER_GROUP
    );

    expect(() => (userService as any).getGroupIfCommon(USER.id, TARGET_USER_ID)).toThrow(
      'Groups do not match'
    );
  });
});
