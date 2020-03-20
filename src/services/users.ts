import {
  createUser,
  getUserByUsername,
  createUserRole,
  changePassword,
  changeRole,
  getUsers,
} from '../repositories/users';
import { PasswordService } from './password';
import { JWTService } from './jwt';
import { ExistError, InvalidCredentialsError, NotFoundError } from '../errors';
import { getMembershipById } from '../repositories/groups';

export enum RoleType {
  Administrator = 1,
  Member = 2,
}

interface User {
  username: string;
  fullName: string;
  role: RoleType | string;
}

export class UserService {
  public async getUsers(): Promise<User[]> {
    const users = await getUsers();

    return users.map(user => ({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    }));
  }

  public async changePassword(
    username: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await getUserByUsername(username);

    const isPasswordCorrect = await this.comparePasswords(currentPassword, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError('Current password is incorrect');
    }

    const newPasswordHash = await this.createPasswordHash(newPassword);
    await changePassword(username, newPasswordHash);
  }

  public async changeRole(userId: number, roleType: RoleType, groupId: number): Promise<void> {
    const membership = await getMembershipById(userId, groupId);
    if (!membership) {
      throw new NotFoundError('User or group is not found');
    }
    await changeRole(userId, roleType);
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await getUserByUsername(username);
    if (!user) {
      throw new NotFoundError('User does not exist');
    }
    return {
      username: user.username,
      fullName: user.fullName,
      role: RoleType[user.role],
    };
  }

  public async createPasswordHash(password: string): Promise<string> {
    const passwordService = new PasswordService();
    return await passwordService.hashPassword(password);
  }

  private async comparePasswords(
    receivedPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const passwordService = new PasswordService();
    return await passwordService.comparePasswords(receivedPassword, hashedPassword);
  }
}

export class SignupService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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

    const passwordHash = await this.userService.createPasswordHash(password);
    const userId = await createUser(username, passwordHash, fullName);
    await this.createUserRole(userId, RoleType[RoleType[role]]);
    return userId;
  }

  private async createUserRole(userId: number, roleType: RoleType): Promise<void> {
    await createUserRole(userId, roleType);
  }
}

export class SigninService {
  public async doSignin(username: string, password: string): Promise<string> {
    const user = await getUserByUsername(username);
    if (!user) {
      throw new InvalidCredentialsError('Username is incorrect');
    }
    const isPasswordCorrect = await this.comparePasswords(password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError('Password is incorrect');
    }
    return this.getToken(username);
  }

  private async comparePasswords(
    receivedPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const passwordService = new PasswordService();
    return await passwordService.comparePasswords(receivedPassword, hashedPassword);
  }

  private getToken(username: string): string {
    const jwtService = new JWTService();
    return jwtService.getToken(username);
  }
}
