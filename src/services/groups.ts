import {
  createGroup,
  getGroups,
  createGroupMember,
  getGroupMembers,
  getGroupById,
  getGroupByName,
  getMembershipByUserId,
} from '../repositories/groups';
import { ExistError, NotFoundError } from '../errors';

interface Group {
  id: number;
  name: string;
}

interface GroupMember {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

export class GroupService {
  public async createGroup(name: string): Promise<number> {
    const group = await getGroupByName(name);
    if (group) {
      throw new ExistError('Group already exists');
    }
    return await createGroup(name);
  }

  public async getGroups(): Promise<Group[]> {
    const res = await getGroups();
    return res.map(group => ({
      id: group.id,
      name: group.name,
    }));
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

  public async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    const group = await getGroupById(groupId);
    if (!group) {
      throw new NotFoundError('Group does not exist');
    }
    const res = await getGroupMembers(groupId);
    return res.map(groupMember => ({
      id: groupMember.id,
      username: groupMember.username,
      fullName: groupMember.fullName,
      role: groupMember.role,
    }));
  }
}
