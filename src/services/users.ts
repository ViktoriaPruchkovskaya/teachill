import {
  createUser,
  getUserByUsername,
  createUserRole,
  changePassword,
  changeRole,
} from '../repositories/users';
import { PasswordService } from './password';
import { JWTService } from './jwt';
import { ExistError, InvalidCredentialsError, NotFoundError } from '../errors';
import { getMembershipByUserId } from '../repositories/groups';

export enum RoleType {
  Administrator = 1,
  Member = 2,
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

export class UserService extends SignupService {
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
    const newPasswordHash = await this.createPasswordHash(newPassword);
    await changePassword(username, newPasswordHash);
  }

  public async changeRole(userId: number, roleType: RoleType, groupId: number): Promise<void> {
    const group = await getMembershipByUserId(userId);
    if (group != groupId) {
      throw new NotFoundError('User is not found');
    }
    await changeRole(userId, roleType);
  }
}
