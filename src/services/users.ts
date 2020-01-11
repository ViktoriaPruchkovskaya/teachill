import * as bcrypt from 'bcrypt';
import { createUser } from '../repositories/users';

export class SignupService {
  public async doSignup(username: string, password: string, fullName: string): Promise<void> {
    const passwordHash = await this.createPasswordHash(password);
    await createUser(username, passwordHash, fullName);
  }

  private async createPasswordHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
