import { createUser, getUserByUsername } from '../repositories/users';
import { PasswordService } from './password';
import { JWTService } from './jwt';

export class SignupService {
  public async doSignup(username: string, password: string, fullName: string): Promise<void> {
    const passwordHash = await this.createPasswordHash(password);
    await createUser(username, passwordHash, fullName);
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
