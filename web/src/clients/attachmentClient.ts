import { BaseTeachillAuthClient } from './baseClient';
import { handleError } from '../handleError';

interface AttachmentPayload {
  name: string;
  url: string;
}

interface Attachment {
  id: number;
  name: string;
  url: string;
}

export class AttachmentClient extends BaseTeachillAuthClient {
  public async createAttachment(payload: AttachmentPayload): Promise<number> {
    const response = await fetch('/api/attachments/', {
      method: 'POST',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      await handleError(response, 'Attach');
    }
    const attachment = await response.json();
    return attachment.attachmentId;
  }

  public async assignAttachment(lessonId: number, attachmentId: number): Promise<void> {
    await fetch(`/api/lessons/${lessonId}/attachments/${attachmentId}`, {
      method: 'POST',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });
  }

  public async deleteAttachment(attachmentId: number): Promise<void> {
    await fetch(`/api/attachments/${attachmentId}`, {
      method: 'DELETE',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });
  }

  public async getLessonAttachments(lessonId: number): Promise<Attachment[]> {
    const response = await fetch(`/api/lessons/${lessonId}/attachments/`, {
      method: 'GET',
      headers: {
        ...this.getCommonHeaders(),
        ...this.getAuthHeaders(),
      },
    });

    const attachments: Attachment[] = await response.json();
    return attachments.map(attachment => ({
      id: attachment.id,
      name: attachment.name,
      url: attachment.url,
    }));
  }
}
