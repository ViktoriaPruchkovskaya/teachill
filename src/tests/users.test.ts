import { SignupService, SigninService, UserService, RoleType } from '../services/users';
import { PasswordService } from '../services/password';
import { JWTService } from '../services/jwt';
import * as usersRepository from '../repositories/users';
import * as groupsRepository from '../repositories/groups';
import * as userMocks from './mocks/users';
import * as passwordMock from './mocks/password';
import { getToken } from './mocks/jwt';
import { getMembershipById, getNonexistentMembershipById } from './mocks/groups';

const mockedUsers = usersRepository as jest.Mocked<typeof usersRepository>;
const mockedGroups = groupsRepository as jest.Mocked<typeof groupsRepository>;

describe('test signup service', () => {
  it('test user signup', async () => {
    const USERNAME = 'petrov';
    const PASSWORD = '1234password';
    const FULLNAME = 'Petrov A.A.';
    const ROLE = 1;
    const signupService = new SignupService();
    (signupService as any).passwordService = new PasswordService();
    mockedUsers.getUserByUsername = userMocks.getNonexistentUserByUsername();
    (signupService as any).passwordService.hashPassword = passwordMock.hashPassword();
    mockedUsers.createUser = userMocks.createUser();
    (signupService as any).createUserRole = userMocks.createUserRole();

    const id = await signupService.doSignup(USERNAME, PASSWORD, FULLNAME, ROLE);

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect((signupService as any).passwordService.hashPassword).toBeCalledTimes(1);
    expect(mockedUsers.createUser).toBeCalledTimes(1);
    expect((signupService as any).createUserRole).toBeCalledTimes(1);
    expect(await mockedUsers.getUserByUsername(USERNAME)).toBeNull();
    expect(await (signupService as any).passwordService.hashPassword(PASSWORD)).toBe(
      `2134${PASSWORD}`
    );
    expect(id).toBe(1);
  });

  it('test user signup with username that already exists', async () => {
    const USERNAME = 'petrov';
    const PASSWORD = '1234password';
    const FULLNAME = 'Petrov A.A.';
    const ROLE = 1;
    const signupService = new SignupService();
    (signupService as any).passwordService = new PasswordService();
    mockedUsers.getUserByUsername = userMocks.getUserByUsername();
    (signupService as any).passwordService.hashPassword = passwordMock.hashPassword();
    mockedUsers.createUser = userMocks.createUser();
    (signupService as any).createUserRole = userMocks.createUserRole();

    await expect(signupService.doSignup(USERNAME, PASSWORD, FULLNAME, ROLE)).rejects.toThrow(
      'Username already exists'
    );

    expect(mockedUsers.getUserByUsername).toBeCalledTimes(1);
    expect((signupService as any).passwordService.hashPassword).not.toBeCalled();
    expect(mockedUsers.createUser).not.toBeCalled();
    expect((signupService as any).createUserRole).not.toBeCalled();
    expect((await mockedUsers.getUserByUsername(USERNAME)).username).toBe(USERNAME);
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
    const USER_ID = 1;
    const ROLE_TYPE = 1;
    const GROUP_ID = 2;
    const userService = new UserService();
    mockedGroups.getMembershipById = getMembershipById();
    mockedUsers.changeRole = userMocks.createUserRole();

    await userService.changeRole(USER_ID, ROLE_TYPE, GROUP_ID);

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedUsers.changeRole).toBeCalledTimes(1);
    expect(await mockedGroups.getMembershipById(USER_ID)).toBe(2);
  });

  it('test changing user role with membership in another group or group does not exist', async () => {
    const USER_ID = 1;
    const ROLE_TYPE = 1;
    const GROUP_ID = 1;
    const userService = new UserService();
    mockedGroups.getMembershipById = getNonexistentMembershipById();
    mockedUsers.changeRole = userMocks.createUserRole();

    await expect(userService.changeRole(USER_ID, ROLE_TYPE, GROUP_ID)).rejects.toThrow(
      'User or group is not found'
    );

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedUsers.changeRole).not.toBeCalled();
    expect(await mockedGroups.getMembershipById(USER_ID)).toBeNull();
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
});
