import * as bcrypt from 'bcrypt';

export class PasswordService {
  private readonly saltRounds = 10;
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  public async comparePasswords(
    receivedPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(receivedPassword, hashedPassword);
  }
}
