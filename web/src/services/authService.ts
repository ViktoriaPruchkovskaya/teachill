import { BaseTeachillClient } from './baseClient';

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

export class AuthService extends BaseTeachillClient {
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
      const { errors } = await response.json();
      const messages = errors.map((error: { message: string }) => error.message);
      throw new Error(`Authentication error: Reason: ${messages.join(', ')}`);
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
      const { errors } = await response.json();
      const messages = errors.map((error: { message: string }) => error.message);
      throw new Error(`Registration error: Reason: ${messages.join(', ')}`);
    }
    const { userId } = await response.json();
    return userId;
  }
}
