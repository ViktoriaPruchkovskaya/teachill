import { BaseTeachillAuthClient } from './baseClient';
import { handleError } from '../handleError';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: number;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangeFullNamePayload {
  fullName: string;
}

interface ChangeRolePayload {
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

  public async changeRole(payload: ChangeRolePayload): Promise<void> {
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

  public async changePassword(payload: ChangePasswordPayload): Promise<void> {
    const response = await fetch('/api/users/me/changePassword', {
      method: 'PUT',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      await handleError(response, 'Change Error');
    }
  }

  public async changeFullName(payload: ChangeFullNamePayload): Promise<void> {
    const response = await fetch('/api//users/me/', {
      method: 'PATCH',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      await handleError(response, 'Change Error');
    }
  }
}
