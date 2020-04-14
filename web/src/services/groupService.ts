import { BaseTeachillAuthClient } from './baseClient';

interface GroupPayload {
  name: string;
}

export class GroupService extends BaseTeachillAuthClient {
  public async createGroup(payload: GroupPayload): Promise<number> {
    const response = await fetch('/api/groups/', {
      method: 'POST',
      headers: { ...this.getCommonHeaders(), ...this.getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    const { groupId } = await response.json();
    return groupId;
  }

  public async assignUserToGroup(groupId: number, userId: number): Promise<void> {
    await fetch(`/api/groups/${groupId}/users/`, {
      method: 'POST',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ userId }),
    });
  }
}
