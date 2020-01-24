import {
  createAttachment,
  createLessonAttachment,
  getLessonAttachments,
} from '../repositories/attachments';

interface LessonAttachment {
  name: string;
  url: string;
}

export class AttachmentService {
  public async createAttachment(name: string, url: string): Promise<void> {
    return await createAttachment(name, url);
  }

  public async createLessonAttachment(lessonId: number, attachmentId: number): Promise<void> {
    return await createLessonAttachment(lessonId, attachmentId);
  }

  public async getLessonAttachments(lessonId: number): Promise<LessonAttachment[]> {
    const res = getLessonAttachments(lessonId);
    const lessonAttachment: LessonAttachment[] = (await res).map(attachment => {
      const res: LessonAttachment = {
        name: attachment.name as string,
        url: attachment.url as string,
      };
      return res;
    });
    return lessonAttachment;
  }
}
