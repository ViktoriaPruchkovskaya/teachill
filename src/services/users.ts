import { createUser, getUserByUsername, createUserRole } from '../repositories/users';
import { PasswordService } from './password';
import { JWTService } from './jwt';

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
      throw new Error('Username already exists');
    }

    const passwordHash = await this.createPasswordHash(password);
    const userId = await createUser(username, passwordHash, fullName);
    await this.createUserRole(userId, RoleType[RoleType[role]]);
    return userId;
  }

  private async createUserRole(userId: number, roleType: RoleType): Promise<void> {
    await createUserRole(userId, roleType);
  }

  private async createPasswordHash(password: string): Promise<string> {
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
