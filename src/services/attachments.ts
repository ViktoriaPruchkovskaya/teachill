import {
  createAttachment,
  getGroupLessonAttachment,
  getAttachmentById,
  assignToGroupLesson,
  deleteAttachment,
} from '../repositories/attachments';
import { getGroupLessonById } from '../repositories/lessons';
import { NotFoundError } from '../errors';

export interface Attachment {
  id: number;
  name: string;
  url: string;
}
export class AttachmentService {
  public async createAttachment(name: string, url: string): Promise<void> {
    return await createAttachment(name, url);
  }

  public async assignToGroupLesson(
    attachmentId: number,
    lessonId: number,
    groupId: number
  ): Promise<void> {
    const lesson = await getGroupLessonById(groupId, lessonId);
    const attachment = await getAttachmentById(attachmentId);
    if (!lesson) {
      throw new NotFoundError('Group or lesson does not exist');
    }
    if (!attachment) {
      throw new NotFoundError('Attachment does not exist');
    }

    return await assignToGroupLesson(attachmentId, lessonId, groupId);
  }

  public async getGroupLessonAttachment(lessonId: number, groupId: number): Promise<Attachment[]> {
    const lesson = await getGroupLessonById(groupId, lessonId);
    if (!lesson) {
      throw new NotFoundError('Group or lesson does not exist');
    }

    const res = await getGroupLessonAttachment(lessonId, groupId);
    const attachments: Attachment[] = res.map(attachment => {
      const res: Attachment = {
        id: attachment.id,
        name: attachment.name,
        url: attachment.url,
      };
      return res;
    });
    return attachments;
  }

  public async deleteAttachment(
    attachmentId: number,
    lessonId: number,
    groupId: number
  ): Promise<void> {
    await deleteAttachment(attachmentId, lessonId, groupId);
  }
}
