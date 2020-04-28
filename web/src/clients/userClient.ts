import { BaseTeachillAuthClient } from './baseClient';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: number;
}

export class UserClient extends BaseTeachillAuthClient {
  public async getCurrentUser(): Promise<User> {
    const response = await fetch('/api/users/me/', {
      method: 'GET',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });
    const user = await response.json();
    return {
      id: user.id as number,
      username: user.username as string,
      fullName: user.fullName as string,
      role: user.role as number,
    };
  }
}
