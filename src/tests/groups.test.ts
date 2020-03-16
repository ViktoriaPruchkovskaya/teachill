import { GroupService } from '../services/groups';
import * as groupsRepository from '../repositories/groups';
import * as usersRepository from '../repositories/users';
import * as groupMocks from './mocks/groups';
import { getUserById, getNonexistentUserById } from './mocks/users';

const mockedGroups = groupsRepository as jest.Mocked<typeof groupsRepository>;
const mockedUsers = usersRepository as jest.Mocked<typeof usersRepository>;

describe('test groups service', () => {
  it('test group creation', async () => {
    const GROUP_NAME = '123456';
    const groupService = new GroupService();
    mockedGroups.getGroupByName = groupMocks.getNonexistentGroupByName();
    mockedGroups.createGroup = groupMocks.createGroup();

    const group = await groupService.createGroup(GROUP_NAME);

    expect(mockedGroups.getGroupByName).toBeCalledTimes(1);
    expect(mockedGroups.createGroup).toBeCalledTimes(1);
    expect(await mockedGroups.getGroupByName(GROUP_NAME)).toBeNull();
    expect(group).toBe(1);
  });

  it('test group creation with name that already exists', async () => {
    const GROUP_NAME = '123456';
    const groupService = new GroupService();
    mockedGroups.getGroupByName = groupMocks.getGroupByName();
    mockedGroups.createGroup = groupMocks.createGroup();

    await expect(groupService.createGroup(GROUP_NAME)).rejects.toThrow('Group already exists');

    expect(mockedGroups.getGroupByName).toBeCalledTimes(1);
    expect(mockedGroups.createGroup).not.toBeCalled();
    expect((await mockedGroups.getGroupByName(GROUP_NAME)).name).toEqual(GROUP_NAME);
  });

  it('test getting group list', async () => {
    const groupService = new GroupService();
    mockedGroups.getGroups = groupMocks.getGroups();

    const groups = await groupService.getGroups();

    expect(mockedGroups.getGroups).toBeCalledTimes(1);
    expect(groups).toEqual([
      { id: 1, name: '123456' },
      { id: 2, name: '654321' },
    ]);
  });

  it('test getting empty group list', async () => {
    const groupService = new GroupService();
    mockedGroups.getGroups = groupMocks.getEmptyGroupsArray();

    const groups = await groupService.getGroups();

    expect(mockedGroups.getGroups).toBeCalledTimes(1);
    expect(groups).toEqual([]);
  });

  it('test member assignment to group', async () => {
    const USER_ID = 1;
    const GROUP_ID = 2;
    const groupService = new GroupService();
    mockedGroups.getGroupById = groupMocks.getGroupById();
    mockedGroups.getMembershipByUserId = groupMocks.getNonexistentMembershipById();
    mockedGroups.createGroupMember = groupMocks.createGroupMember();
    mockedUsers.getUserById = getUserById();

    await groupService.createGroupMember(USER_ID, GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedUsers.getUserById).toBeCalledTimes(1);
    expect(mockedGroups.getMembershipByUserId).toBeCalledTimes(1);
    expect(mockedGroups.createGroupMember).toBeCalledTimes(1);
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect(Object.keys(await mockedUsers.getUserById(USER_ID))).toEqual([
      'username',
      'passwordHash',
      'fullName',
      'role',
    ]);
    expect(await mockedGroups.getMembershipByUserId(USER_ID)).toBeNull();
  });

  it('test member assignment to nonexistent group', async () => {
    const USER_ID = 1;
    const GROUP_ID = 2;
    const groupService = new GroupService();
    mockedGroups.getGroupById = groupMocks.getNonexistentGroup();
    mockedGroups.getMembershipByUserId = groupMocks.getNonexistentMembershipById();
    mockedGroups.createGroupMember = groupMocks.createGroupMember();
    mockedUsers.getUserById = getUserById();

    await expect(groupService.createGroupMember(USER_ID, GROUP_ID)).rejects.toThrow(
      'Group or user does not exist'
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedUsers.getUserById).toBeCalledTimes(1);
    expect(mockedGroups.getMembershipByUserId).not.toBeCalled();
    expect(mockedGroups.createGroupMember).not.toBeCalled();
    expect(await mockedGroups.getGroupById(GROUP_ID)).toBeNull();
    expect(Object.keys(await mockedUsers.getUserById(USER_ID))).toEqual([
      'username',
      'passwordHash',
      'fullName',
      'role',
    ]);
    expect(await mockedGroups.getMembershipByUserId(USER_ID)).toBeNull();
  });

  it('test assignment of nonexistent member to a group', async () => {
    const USER_ID = 1;
    const GROUP_ID = 2;
    const groupService = new GroupService();
    mockedGroups.getGroupById = groupMocks.getGroupById();
    mockedGroups.getMembershipByUserId = groupMocks.getNonexistentMembershipById();
    mockedGroups.createGroupMember = groupMocks.createGroupMember();
    mockedUsers.getUserById = getNonexistentUserById();

    await expect(groupService.createGroupMember(USER_ID, GROUP_ID)).rejects.toThrow(
      'Group or user does not exist'
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedUsers.getUserById).toBeCalledTimes(1);
    expect(mockedGroups.getMembershipByUserId).not.toBeCalled();
    expect(mockedGroups.createGroupMember).not.toBeCalled();
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect(await mockedUsers.getUserById(USER_ID)).toBeNull();
  });

  it('test assignment of member to a group, who is already in another group', async () => {
    const USER_ID = 1;
    const GROUP_ID = 2;
    const groupService = new GroupService();
    mockedGroups.getGroupById = groupMocks.getGroupById();
    mockedGroups.getMembershipByUserId = groupMocks.getMembershipById();
    mockedGroups.createGroupMember = groupMocks.createGroupMember();
    mockedUsers.getUserById = getUserById();

    await expect(groupService.createGroupMember(USER_ID, GROUP_ID)).rejects.toThrow(
      `User is already in group ${await mockedGroups.getMembershipByUserId(USER_ID)}`
    );

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedUsers.getUserById).toBeCalledTimes(1);
    expect(mockedGroups.getMembershipByUserId).toBeCalledTimes(2);
    expect(mockedGroups.createGroupMember).not.toBeCalled();
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect(Object.keys(await mockedUsers.getUserById(USER_ID))).toEqual([
      'username',
      'passwordHash',
      'fullName',
      'role',
    ]);
    expect(await mockedGroups.getMembershipByUserId(USER_ID)).toEqual(
      (await mockedGroups.getGroupById(GROUP_ID)).name
    );
  });

  it('test getting group members', async () => {
    const GROUP_ID = 2;
    const groupService = new GroupService();
    mockedGroups.getGroupById = groupMocks.getGroupById();
    mockedGroups.getGroupMembers = groupMocks.getGroupMembers();

    const members = await groupService.getGroupMembers(GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedGroups.getGroupMembers).toBeCalledTimes(1);
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect(members).toEqual([
      { id: 1, username: 'petrov', fullName: 'Petrov V.V.', role: 'Member' },
      { id: 1, username: 'ivanov', fullName: 'Ivanov V.V.', role: 'Administrator' },
    ]);
  });

  it('test getting group members of nonexistent group', async () => {
    const GROUP_ID = 2;
    const groupService = new GroupService();
    mockedGroups.getGroupById = groupMocks.getNonexistentGroup();
    mockedGroups.getGroupMembers = groupMocks.getGroupMembers();

    await expect(groupService.getGroupMembers(GROUP_ID)).rejects.toThrow('Group does not exist');

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedGroups.getGroupMembers).not.toBeCalled();
    expect(await mockedGroups.getGroupById(GROUP_ID)).toBeNull();
  });

  it('test getting group members of empty group', async () => {
    const GROUP_ID = 2;
    const groupService = new GroupService();
    mockedGroups.getGroupById = groupMocks.getGroupById();
    mockedGroups.getGroupMembers = groupMocks.getEmptyGroupMembersArray();

    const members = await groupService.getGroupMembers(GROUP_ID);

    expect(mockedGroups.getGroupById).toBeCalledTimes(1);
    expect(mockedGroups.getGroupMembers).toBeCalledTimes(1);
    expect((await mockedGroups.getGroupById(GROUP_ID)).id).toBe(GROUP_ID);
    expect(members).toEqual([]);
  });

  it('test getting group by name', async () => {
    const GROUP_NAME = '123456';
    const groupService = new GroupService();
    mockedGroups.getGroupByName = groupMocks.getGroupByName();

    const group = await groupService.getGroupByName(GROUP_NAME);

    expect(mockedGroups.getGroupByName).toBeCalledTimes(1);
    expect(group.name).toBe(GROUP_NAME);
  });

  it('test nonexistent getting group by name', async () => {
    const GROUP_NAME = '123456';
    const groupService = new GroupService();
    mockedGroups.getGroupByName = groupMocks.getNonexistentGroupByName();

    await expect(groupService.getGroupByName(GROUP_NAME)).rejects.toThrow('Group does not exist');

    expect(mockedGroups.getGroupByName).toBeCalledTimes(1);
  });
});
