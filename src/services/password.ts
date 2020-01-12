import * as bcrypt from 'bcrypt';

export class PasswordService {
  private readonly saltRounds = 10;
  public async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.saltRounds);
    return hash;
  }

  public async comparePasswords(
    receivedPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const comparison = await bcrypt.compare(receivedPassword, hashedPassword);
    return comparison;
  }
}
