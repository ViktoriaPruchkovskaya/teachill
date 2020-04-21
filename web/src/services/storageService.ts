import { Group } from './groupService';

export class StorageService {
  private readonly tokenKey = 'teachillToken';
  private readonly groupKey = 'userGroup';

  public getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }

  public setToken(authToken: string): void {
    localStorage.setItem(this.tokenKey, authToken);
  }

  public getUserGroup(): Group {
    const group = JSON.parse(localStorage.getItem(this.groupKey));
    return { id: group.id as number, name: group.name as string };
  }

  public setUserGroup(group: Group): void {
    localStorage.setItem(this.groupKey, JSON.stringify(group));
  }
}
