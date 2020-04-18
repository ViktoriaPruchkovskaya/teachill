import { Group } from './groupService';

export class StorageService {
  public getToken(): string {
    return localStorage.getItem('teachillToken');
  }

  public setToken(authToken: string): void {
    localStorage.setItem('teachillToken', authToken);
  }

  public getUserGroup(): Group {
    const group = JSON.parse(localStorage.getItem('userGroup'));
    return { id: group.id as number, name: group.name as string };
  }

  public setUserGroup(group: Group): void {
    localStorage.setItem('userGroup', JSON.stringify(group));
  }
}
