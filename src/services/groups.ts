import {
  createGroup,
  getGroups,
  createGroupMember,
  getGroupMembers,
  getGroupById,
  getGroupByName,
  getMembershipById,
} from '../repositories/groups';
import { ExistError, NotFoundError } from '../errors';
import { getUserById } from '../repositories/users';

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
    return createGroup(name);
  }

  public async getGroups(): Promise<Group[]> {
    const groups = await getGroups();
    return groups.map(group => ({
      id: group.id,
      name: group.name,
    }));
  }

  public async createGroupMember(userId: number, groupId: number): Promise<void> {
    const group = await getGroupById(groupId);
    const user = await getUserById(userId);
    if (!group || !user) {
      throw new NotFoundError('Group or user does not exist');
    }

    const membership = await getMembershipById(userId, groupId);
    if (membership) {
      throw new ExistError('User is already in another group');
    }
    return createGroupMember(userId, groupId);
  }

  public async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    const group = await getGroupById(groupId);
    if (!group) {
      throw new NotFoundError('Group does not exist');
    }
    const members = await getGroupMembers(groupId);
    return members.map(groupMember => ({
      id: groupMember.id,
      username: groupMember.username,
      fullName: groupMember.fullName,
      role: groupMember.role,
    }));
  }

  public async getGroupByName(name: string): Promise<Group> {
    const group = await getGroupByName(name);
    if (!group) {
      throw new NotFoundError('Group does not exist');
    }
    return { id: group.id, name: group.name };
  }
}
