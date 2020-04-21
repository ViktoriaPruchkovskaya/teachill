import { BaseTeachillClient } from './baseClient';
import { handleError } from '../handleError';

export enum RoleType {
  Administrator = 1,
  Member = 2,
}

interface SigninPayload {
  username: string;
  password: string;
}

interface SignupPayload {
  fullName: string;
  username: string;
  password: string;
  role: number;
}

export class AuthClient extends BaseTeachillClient {
  /**
   * signin performs authentication against teachill backend.
   * @param payload - signin payload.
   * @returns string containing token.
   */
  public async signin(payload: SigninPayload): Promise<string> {
    const response = await fetch('/api/signin/', {
      method: 'POST',
      headers: this.getCommonHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      await handleError(response, 'Authentication');
    }
    const { token } = await response.json();
    return token;
  }

  public async signup(payload: SignupPayload): Promise<number> {
    const response = await fetch('/api/signup/', {
      method: 'POST',
      headers: this.getCommonHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      await handleError(response, 'Registration');
    }
    const { userId } = await response.json();
    return userId;
  }
}
