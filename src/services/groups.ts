import {
  createGroup,
  getGroups,
  createGroupMember,
  getGroupMembers,
  getGroupById,
  getMembershipByUserId,
} from '../repositories/groups';
import { ExistError, NotFoundError } from '../errors';

interface DBGroup {
  id: number;
  name: string;
}

interface DBGroupMember {
  id: number;
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

  public async getGroups(): Promise<DBGroup[]> {
    const res = await getGroups();
    const groups: DBGroup[] = res.map(group => {
      const res: DBGroup = {
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

  public async getGroupMembers(groupId: number): Promise<DBGroupMember[]> {
    const res = await getGroupMembers(groupId);
    const createdGroupMembers: DBGroupMember[] = res.map(groupMember => {
      const res: DBGroupMember = {
        id: groupMember.id,
        username: groupMember.username,
        fullName: groupMember.fullName,
        role: groupMember.role,
      };
      return res;
    });
    return createdGroupMembers;
  }
}
