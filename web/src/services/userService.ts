import { UserClient } from '../clients/userClient';
import { StorageService } from './storageService';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: number;
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
}