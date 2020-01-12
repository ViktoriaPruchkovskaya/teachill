import { createUser } from '../repositories/users';
import { PasswordService } from './password';

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

// export class SinginService {
//   private async doSignin(username: string, password: string) {}
// }
