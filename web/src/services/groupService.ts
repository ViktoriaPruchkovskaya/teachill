import { GroupClient } from '../clients/groupClient';
import { StorageService } from './storageService';
import { User } from './userService';

interface GroupPayload {
  name: string;
}

export interface Group {
  id: number;
  name: string;
}

export class GroupService {
  private groupClient: GroupClient;
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
    const token = this.storageService.getToken();
    this.groupClient = new GroupClient(token);
  }

  public async createGroup(payload: GroupPayload): Promise<number> {
    return this.groupClient.createGroup(payload);
  }

  public async assignUserToGroup(groupId: number, userId: number): Promise<void> {
    return this.groupClient.assignUserToGroup(groupId, userId);
  }

  public async getCurrentGroup(): Promise<Group> {
    const group = await this.groupClient.getCurrentGroup();
    this.storageService.setUserGroup(group);
    return group;
  }

  public async getMembers(): Promise<User[]> {
    const group = this.storageService.getUserGroup();
    const users = await this.groupClient.getMembers(group.id);
    return users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    }));
  }
}
