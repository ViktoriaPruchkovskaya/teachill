export const getGroupById = () =>
  jest.fn((groupId: number) => Promise.resolve({ id: groupId, name: 'group' }));

export const getNonexistentGroup = () => jest.fn((groupId: number) => Promise.resolve(null));
