export const getUserById = () =>
  jest.fn((id: number) =>
    Promise.resolve({
      username: 'username',
      passwordHash: 'hashedPassword',
      fullName: 'fullName',
      role: 'role',
    })
  );

export const getNonexistentUserById = () => jest.fn((id: number) => Promise.resolve(null));
