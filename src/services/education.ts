import { createGroup } from '../repositories/education';

export class GroupService {
  public async createGroup(id: number, name: string): Promise<number> {
    return await createGroup(id, name);
  }
}
