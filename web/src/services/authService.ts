import { BaseTeachillClient } from './baseClient';
import { LocalStorageService } from './localStorageService';
import { GroupService } from './groupService';

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

interface UserSignupPayload {
  fullName: string;
  username: string;
  password: string;
  role: number;
  name: string;
}

export class AuthService extends BaseTeachillClient {
  /**
   * signin performs authentication against teachill backend.
   * @param payload - signin payload.
   * @returns string containing token.
   */
  private localStorageService: LocalStorageService;

  constructor() {
    super();
    this.localStorageService = new LocalStorageService();
  }

  public async signin(payload: SigninPayload): Promise<void> {
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
    this.localStorageService.setToken(token);

    const groupService = new GroupService(token);
    const group = await groupService.getCurrentGroup();
    this.localStorageService.setUserGroup(group);
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

  public async signupAdmin(payload: UserSignupPayload): Promise<void> {
    payload.role = RoleType.Administrator;
    const userId = await this.signup(payload);

    await this.signin(payload);
    const token = this.localStorageService.getToken();

    const groupService = new GroupService(token);
    const groupId = await groupService.createGroup(payload);

    await groupService.assignUserToGroup(groupId, userId);

    const group = await groupService.getCurrentGroup();
    this.localStorageService.setUserGroup(group);
  }

  public async signupUser(payload: UserSignupPayload): Promise<void> {
    payload.role = RoleType.Member;
    const userId = await this.signup(payload);

    const token = this.localStorageService.getToken();
    const { id } = this.localStorageService.getUserGroup();

    const groupService = new GroupService(token);
    await groupService.assignUserToGroup(id, userId);
  }
}
