import { BaseTeachillAuthClient } from './baseClient';
import { handleError } from '../handleError';

interface UpdateLessonPayload {
  id: number;
  description: string;
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

export class LessonClient extends BaseTeachillAuthClient {
  public async updateLesson(payload: UpdateLessonPayload): Promise<void> {
    const response = await fetch(`/api/lessons/${payload.id}/`, {
      method: 'PATCH',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      await handleError(response, 'Update lesson');
    }
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

  public async updateSchedule(groupId: number): Promise<void> {
    const response = await fetch(`/api/groups/${groupId}/sync/`, {
      method: 'POST',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });
    if (!response.ok) {
      await handleError(response, 'Sync');
    }
  }
}
