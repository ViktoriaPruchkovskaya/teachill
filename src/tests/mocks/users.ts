import { RoleType } from '../../services/users';

export const getUserById = () =>
  jest.fn((id: number) =>
    Promise.resolve({
      username: 'username',
      passwordHash: '2134password',
      fullName: 'fullName',
      role: 'role',
    })
  );

export const getNonexistentUserById = () => jest.fn((id: number) => Promise.resolve(null));

export const getUserByUsername = () =>
  jest.fn((username: string) =>
    Promise.resolve({
      username: username,
      passwordHash: '2134password',
      fullName: 'fullName',
      role: 'role',
    })
  );

export const getNonexistentUserByUsername = () =>
  jest.fn((username: string) => Promise.resolve(null));

export const createUser = () =>
  jest.fn((username: string, passwordHash: string, fullName: string) => Promise.resolve(1));

export const createUserRole = () =>
  jest.fn((userId: number, roleType: RoleType) => Promise.resolve());

export const getUsers = () =>
  jest.fn(() =>
    Promise.resolve([
      { username: 'user1', passwordHash: '123password', fullName: 'user', role: 'role' },
      { username: 'user2', passwordHash: '321password', fullName: 'user user', role: 'role' },
    ])
  );

export const getEmptyUsersArray = () => jest.fn(() => Promise.resolve([]));

export const changePassword = () =>
  jest.fn((username: string, passwordHash: string) => Promise.resolve());
