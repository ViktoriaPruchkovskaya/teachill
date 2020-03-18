export const hashPassword = () => jest.fn((password: string) => Promise.resolve(`2134${password}`));

export const comparePasswords = () =>
  jest.fn((receivedPassword: string, hashedPassword: string) => {
    hashedPassword = hashedPassword.replace(/^2134/, '');
    if (receivedPassword === hashedPassword) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  });
