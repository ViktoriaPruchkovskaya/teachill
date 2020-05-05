import { BaseTeachillAuthClient } from './baseClient';
import { handleError } from '../handleError';

interface UpdateLessonPayload {
  id: number;
  description: string;
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
}
