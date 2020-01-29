import {
  createGroup,
  getGroups,
  createGroupMember,
  getGroupMembers,
  getGroupById,
  getMembershipByUserId,
} from '../repositories/groups';
import { ExistError, NotFoundError } from '../errors';

interface CreatedGroup {
  id: number;
  name: string;
}

interface CreatedGroupMember {
  username: string;
  fullName: string;
  role: string;
}

export class GroupService {
  public async createGroup(id: number, name: string): Promise<number> {
    const group = await getGroupById(id);
    if (group) {
      throw new ExistError('Group already exists');
    }
    return await createGroup(id, name);
  }

  public async getGroups(): Promise<CreatedGroup[]> {
    const res = await getGroups();
    const groups: CreatedGroup[] = res.map(group => {
      const res: CreatedGroup = {
        id: group.id,
        name: group.name,
      };
      return res;
    });
    return groups;
  }

  public async createGroupMember(userId: number, groupId: number): Promise<void> {
    const group = await getGroupById(groupId);
    if (!group) {
      throw new NotFoundError('Group does not exist');
    }
    const membership = await getMembershipByUserId(userId);
    if (membership) {
      throw new ExistError(`User is already in group ${membership}`);
    }
    return await createGroupMember(userId, groupId);
  }

  public async getGroupMembers(groupId: number): Promise<CreatedGroupMember[]> {
    const res = await getGroupMembers(groupId);
    const createdGroupMembers: CreatedGroupMember[] = res.map(groupMember => {
      const res: CreatedGroupMember = {
        username: groupMember.username,
        fullName: groupMember.fullName,
        role: groupMember.role,
      };
      return res;
    });
    return createdGroupMembers;
  }
}
