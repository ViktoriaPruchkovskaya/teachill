import {
  createUser,
  getUserByUsername,
  createUserRole,
  changePassword,
  changeRole,
  getUsers,
  changeFullName,
} from '../repositories/users';
import { PasswordService } from './password';
import { JWTService } from './jwt';
import { ExistError, InvalidCredentialsError, NotFoundError } from '../errors';
import { getMembershipById } from '../repositories/groups';

export enum RoleType {
  Administrator = 1,
  Member = 2,
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: RoleType;
}

export class UserService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  public async getUsers(): Promise<User[]> {
    const users = await getUsers();

    return users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: RoleType[user.role],
    }));
  }

  public async changePassword(
    username: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await getUserByUsername(username);

    const isPasswordCorrect = await this.passwordService.comparePasswords(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError('Current password is incorrect');
    }

    const newPasswordHash = await this.passwordService.hashPassword(newPassword);
    await changePassword(username, newPasswordHash);
  }

  public async changeRole(userId: number, roleType: RoleType, groupId: number): Promise<void> {
    const membership = await getMembershipById(userId, groupId);
    if (!membership) {
      throw new NotFoundError('User or group is not found');
    }
    await changeRole(userId, roleType);
  }

  public async changeFullName(username: string, fullName: string) {
    await changeFullName(username, fullName);
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await getUserByUsername(username);
    if (!user) {
      throw new NotFoundError('User does not exist');
    }
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: RoleType[user.role],
    };
  }
}

export class SignupService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  public async doSignup(
    username: string,
    password: string,
    fullName: string,
    role: number
  ): Promise<number> {
    const user = await getUserByUsername(username);
    if (user) {
      throw new ExistError('Username already exists');
    }

    const passwordHash = await this.passwordService.hashPassword(password);
    const userId = await createUser(username, passwordHash, fullName);
    await this.createUserRole(userId, RoleType[RoleType[role]]);
    return userId;
  }

  private async createUserRole(userId: number, roleType: RoleType): Promise<void> {
    await createUserRole(userId, roleType);
  }
}

export class SigninService {
  private passwordService: PasswordService;
  private jwtService: JWTService;

  constructor() {
    this.passwordService = new PasswordService();
    this.jwtService = new JWTService();
  }
  public async doSignin(username: string, password: string): Promise<string> {
    const user = await getUserByUsername(username);
    if (!user) {
      throw new InvalidCredentialsError('Username is incorrect');
    }
    const isPasswordCorrect = await this.passwordService.comparePasswords(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError('Password is incorrect');
    }
    return this.jwtService.getToken(username);
  }
}
