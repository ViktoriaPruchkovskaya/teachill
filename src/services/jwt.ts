import * as jwt from 'jsonwebtoken';
import { ConfigurationError } from '../errors';

export class JWTAuthError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    Object.setPrototypeOf(this, JWTAuthError.prototype);
  }
}

interface TokenPayload {
  username: string;
}

export class JWTService {
  private secretKey: string;
  public constructor() {
    if (process.env.SECRET_KEY == null) {
      throw new ConfigurationError('Secret key is missing');
    }
    this.secretKey = process.env.SECRET_KEY;
  }

  public getToken(username: string): string {
    return jwt.sign({ username: username }, this.secretKey);
  }

  public verify(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secretKey) as TokenPayload;
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new JWTAuthError('Authentication failed');
      }
    }
  }
}
