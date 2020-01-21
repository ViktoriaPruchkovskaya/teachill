import {
  createGroup,
  getGroups,
  createGroupMember,
  getGroupMembers,
  getGroupById,
  getMembershipByUserId,
} from '../repositories/education';

export class GroupService {
  public async createGroup(id: number, name: string): Promise<number> {
    const group = await getGroupById(id);
    if (group) {
      throw new Error('Group already exists');
    }
    return await createGroup(id, name);
  }

  public async getGroups(): Promise<string[]> {
    return await getGroups();
  }

  public async createGroupMember(userId: number, groupId: number): Promise<void> {
    const group = await getGroupById(groupId);
    if (!group) {
      throw new Error('Group does not exist');
    }
    const membership = await getMembershipByUserId(userId);
    if (membership) {
      throw new Error(`User is already in group ${membership}`);
    }
    return await createGroupMember(userId, groupId);
  }

  public async getGroupMembers(groupId: number): Promise<string[]> {
    return await getGroupMembers(groupId);
  }
}
