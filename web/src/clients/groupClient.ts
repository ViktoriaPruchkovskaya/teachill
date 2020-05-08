import { BaseTeachillAuthClient } from './baseClient';
import { handleError } from '../handleError';
import { User } from '../services/userService';

interface GroupPayload {
  name: string;
}

interface Group {
  id: number;
  name: string;
}

interface Lesson {
  id: number;
  name: string;
  typeId: number;
  location: string;
  startTime: Date;
  duration: number;
  description?: string;
  teacher?: Teacher[];
  subgroup?: number | null;
  isAttachmentAssigned?: boolean;
}

interface Teacher {
  fullName: string;
}

export class GroupClient extends BaseTeachillAuthClient {
  public async createGroup(payload: GroupPayload): Promise<number> {
    const response = await fetch('/api/groups/', {
      method: 'POST',
      headers: { ...this.getCommonHeaders(), ...this.getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      await handleError(response, 'Registration');
    }
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

  public async getCurrentGroup(): Promise<Group> {
    const response = await fetch('/api/me/group/', {
      method: 'GET',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });

    const group = await response.json();
    return { id: group.id as number, name: group.name as string };
  }

  public async getLessons(): Promise<Lesson[]> {
    const response = await fetch('/api/lessons/', {
      method: 'GET',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });
    const lessons: Lesson[] = await response.json();
    return lessons.map(lesson => ({
      id: lesson.id,
      name: lesson.name,
      typeId: lesson.typeId,
      location: lesson.location,
      startTime: new Date(lesson.startTime),
      duration: lesson.duration,
      description: lesson.description,
      teacher: lesson.teacher,
      subgroup: lesson.subgroup,
      isAttachmentAssigned: lesson.isAttachmentAssigned,
    }));
  }

  public async getMembers(groupId: number): Promise<User[]> {
    const response = await fetch(`/api/groups/${groupId}/users/`, {
      method: 'GET',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });

    const users: User[] = await response.json();
    return users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    }));
  }
}
