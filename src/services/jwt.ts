import * as jwt from 'jsonwebtoken';

export class JWTService {
  public getToken(username: string): string {
    return jwt.sign({ username: username }, 'secretKey');
  }
}
