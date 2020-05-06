import { BaseTeachillAuthClient } from './baseClient';
import { handleError } from '../handleError';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: number;
}

interface ChangeRoleData {
  userId: number;
  roleId: number;
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

  public async deleteUser(userId: number): Promise<void> {
    const response = await fetch(`/api/users/${userId}/`, {
      method: 'DELETE',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });
    if (!response.ok) {
      await handleError(response, 'Deleting Error');
    }
  }

  public async changeRole(payload: ChangeRoleData): Promise<void> {
    const response = await fetch(`/api/users/${payload.userId}/changeRole`, {
      method: 'PUT',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      await handleError(response, 'Changing Error');
    }
  }
}
