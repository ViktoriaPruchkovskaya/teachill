import { BaseTeachillClient } from './baseClient';
import { StorageService } from './storageService';
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
  private storageService: StorageService;

  constructor() {
    super();
    this.storageService = new StorageService();
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
    this.storageService.setToken(token);

    const groupService = new GroupService(token);
    const group = await groupService.getCurrentGroup();
    this.storageService.setUserGroup(group);
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
    const token = this.storageService.getToken();

    const groupService = new GroupService(token);
    const groupId = await groupService.createGroup(payload);

    await groupService.assignUserToGroup(groupId, userId);

    const group = await groupService.getCurrentGroup();
    this.storageService.setUserGroup(group);
  }

  public async signupUser(payload: UserSignupPayload): Promise<void> {
    payload.role = RoleType.Member;
    const userId = await this.signup(payload);

    const token = this.storageService.getToken();
    const { id } = this.storageService.getUserGroup();

    const groupService = new GroupService(token);
    await groupService.assignUserToGroup(id, userId);
  }
}
