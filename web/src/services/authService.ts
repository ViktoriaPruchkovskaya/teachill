import { StorageService } from './storageService';
import { AuthClient } from '../clients/authClient';
import { GroupClient } from '../clients/groupClient';

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

export class AuthService {
  private storageService: StorageService;
  private authClient: AuthClient;

  constructor() {
    this.storageService = new StorageService();
    this.authClient = new AuthClient();
  }

  public async signin(payload: SigninPayload): Promise<void> {
    const token = await this.authClient.signin(payload);
    this.storageService.setToken(token);
  }

  public async signupAdmin(payload: UserSignupPayload): Promise<void> {
    payload.role = RoleType.Administrator;
    const userId = await this.authClient.signup(payload);

    await this.signin(payload);
    const token = this.storageService.getToken();

    const groupService = new GroupClient(token);
    const groupId = await groupService.createGroup(payload);

    await groupService.assignUserToGroup(groupId, userId);

    const group = await groupService.getCurrentGroup();
    this.storageService.setUserGroup(group);
  }

  public async signupUser(payload: UserSignupPayload): Promise<void> {
    payload.role = RoleType.Member;
    const userId = await this.authClient.signup(payload);

    const token = this.storageService.getToken();
    const { id } = this.storageService.getUserGroup();

    const groupService = new GroupClient(token);
    await groupService.assignUserToGroup(id, userId);
  }
}
