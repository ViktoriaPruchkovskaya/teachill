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
import { getMembershipByUserId, getGroupById } from '../repositories/groups';

export enum RoleType {
  Administrator = 1,
  Member = 2,
}

interface User {
  username: string;
  fullName: string;
  role: RoleType | string;
}

export class SignupService {
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

    const passwordHash = await this.createPasswordHash(password);
    const userId = await createUser(username, passwordHash, fullName);
    await this.createUserRole(userId, RoleType[RoleType[role]]);
    return userId;
  }

  private async createUserRole(userId: number, roleType: RoleType): Promise<void> {
    await createUserRole(userId, roleType);
  }

  protected async createPasswordHash(password: string): Promise<string> {
    const passwordService = new PasswordService();
    return await passwordService.hashPassword(password);
  }
}

export class SigninService {
  public async doSignin(username: string, password: string): Promise<string | null> {
    const user = await getUserByUsername(username);
    if (user) {
      const passwordService = new PasswordService();
      const isPasswordCorrect = await passwordService.comparePasswords(password, user.passwordHash);
      if (isPasswordCorrect) {
        const jwtService = new JWTService();
        return jwtService.getToken(user.username);
      }
      return null;
    }
    return null;
  }
}

export class UserService {
  public async getUsers(): Promise<User[]> {
    const users = await getUsers();
    if (users.length === 0) {
      return [];
    }

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
    if (!user) {
      throw new InvalidCredentialsError('Username is incorrect');
    }

    const passwordService = new PasswordService();
    const isPasswordCorrect = await passwordService.comparePasswords(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError('Current password is incorrect');
    }

    const newPasswordHash = await passwordService.hashPassword(newPassword);
    await changePassword(username, newPasswordHash);
  }

  public async changeRole(userId: number, roleType: RoleType, groupId: number): Promise<void> {
    const membership = await getMembershipByUserId(userId);
    const group = await getGroupById(groupId);
    if (group.name != membership) {
      throw new NotFoundError('User is not found');
    }
    await changeRole(userId, roleType);
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await getUserByUsername(username);
    return {
      username: user.username,
      fullName: user.fullName,
      role: RoleType[user.role],
    };
  }
}
