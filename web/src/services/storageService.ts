import { Group } from './groupService';

export class StorageService {
  private readonly tokenKey = 'teachillToken';
  private readonly groupKey = 'userGroup';
  private readonly subgroupsKey = 'subgroups';
  private readonly languageKey = 'language';

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

  public isTokenInStorage(): boolean {
    return localStorage.hasOwnProperty(this.tokenKey);
  }

  public getSubgroups(): Array<number> {
    return JSON.parse(localStorage.getItem(this.subgroupsKey));
  }

  public setSubgroups(subgroups: Array<number>): void {
    localStorage.setItem(this.subgroupsKey, JSON.stringify(subgroups));
  }

  public setLanguage(lang: string): void {
    localStorage.setItem(this.languageKey, lang);
  }

  public clearStorage(): void {
    localStorage.clear();
  }
}
