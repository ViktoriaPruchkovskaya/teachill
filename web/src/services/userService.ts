import { UserClient } from '../clients/userClient';
import { StorageService } from './storageService';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: number;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangeFullNamePayload {
  fullName: string;
}

interface ChangeRolePayload {
  userId: number;
  roleId: number;
}

export class UserService {
  private userClient: UserClient;
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
    const token = this.storageService.getToken();
    this.userClient = new UserClient(token);
  }

  public async getCurrentUser(): Promise<User> {
    const user = await this.userClient.getCurrentUser();
    return {
      id: user.id as number,
      username: user.username as string,
      fullName: user.fullName as string,
      role: user.role as number,
    };
  }

  public async changePassword(payload: ChangePasswordPayload): Promise<void> {
    return this.userClient.changePassword(payload);
  }

  public async changeFullName(payload: ChangeFullNamePayload): Promise<void> {
    return this.userClient.changeFullName(payload);
  }

  public async deleteUser(user: User): Promise<void> {
    return this.userClient.deleteUser(user.id);
  }

  public async changeRole(payload: ChangeRolePayload): Promise<void> {
    return this.userClient.changeRole(payload);
  }
}
