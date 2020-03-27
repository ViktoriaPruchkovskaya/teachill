import { RoleType } from '../../services/users';

export const getGroupById = () =>
  jest.fn((groupId: number) => Promise.resolve({ id: groupId, name: '123456' }));

export const getGroupByName = () =>
  jest.fn((name: string) => Promise.resolve({ id: 1, name: name }));

export const getNonexistentGroupByName = () => jest.fn((name: string) => Promise.resolve(null));

export const getNonexistentGroup = () => jest.fn((groupId: number) => Promise.resolve(null));

export const createGroup = () => jest.fn((name: string) => Promise.resolve(1));

export const getGroups = () =>
  jest.fn(() =>
    Promise.resolve([
      { id: 1, name: '123456' },
      { id: 2, name: '654321' },
    ])
  );

export const getEmptyGroupsArray = () => jest.fn(() => Promise.resolve([]));

export const getMembershipById = () => jest.fn((userId: number) => Promise.resolve(2));

export const getNonexistentMembershipById = () =>
  jest.fn((userId: number) => Promise.resolve(null));

export const createGroupMember = () =>
  jest.fn((userId: number, groupId: number) => Promise.resolve());

export const getGroupMembers = () =>
  jest.fn((groupId: number) =>
    Promise.resolve([
      { id: 1, username: 'petrov', fullName: 'Petrov V.V.', role: 'Member' },
      { id: 2, username: 'ivanov', fullName: 'Ivanov V.V.', role: 'Administrator' },
    ])
  );

export const getEmptyGroupMembersArray = () => jest.fn((groupId: number) => Promise.resolve([]));

export const getGroupMembersMethod = () =>
  jest.fn(async (groupId: number) => {
    const group = await getGroupById()(groupId);
    const members = await getGroupMembers()(group.id);
    return members.map(groupMember => ({
      id: groupMember.id,
      username: groupMember.username,
      fullName: groupMember.fullName,
      role: RoleType[groupMember.role],
    }));
  });
