import * as attachmentsRepository from '../repositories/attachments';
import { getGroupLessonById } from '../repositories/lessons';
import { NotFoundError } from '../errors';

export interface Attachment {
  id: number;
  name: string;
  url: string;
}
export class AttachmentService {
  public async createAttachment(name: string, url: string): Promise<void> {
    return attachmentsRepository.createAttachment(name, url);
  }

  public async assignToGroupLesson(
    attachmentId: number,
    lessonId: number,
    groupId: number
  ): Promise<void> {
    const lesson = await getGroupLessonById(groupId, lessonId);
    const attachment = await attachmentsRepository.getAttachmentById(attachmentId);
    if (!lesson || !attachment) {
      throw new NotFoundError('Group, lesson or attachment does not exist');
    }

    return attachmentsRepository.assignToGroupLesson(attachmentId, lessonId, groupId);
  }

  public async getGroupLessonAttachment(lessonId: number, groupId: number): Promise<Attachment[]> {
    const lesson = await getGroupLessonById(groupId, lessonId);
    if (!lesson) {
      throw new NotFoundError('Group or lesson does not exist');
    }

    const attachments = await attachmentsRepository.getGroupLessonAttachment(lessonId, groupId);
    return attachments.map(attachment => ({
      id: attachment.id,
      name: attachment.name,
      url: attachment.url,
    }));
  }

  public async deleteGroupLessonAttachment(
    attachmentId: number,
    lessonId: number,
    groupId: number
  ): Promise<void> {
    const lessonAttachments = await attachmentsRepository.getGroupLessonAttachment(
      lessonId,
      groupId
    );
    if (!lessonAttachments.some(attachment => attachment.id == attachmentId)) {
      throw new NotFoundError('Group, lesson or attachment does not exist');
    }

    await attachmentsRepository.deleteGroupLessonAttachment(attachmentId, lessonId, groupId);
  }

  public async deleteAttachment(attachmentId: number): Promise<void> {
    const attachment = await attachmentsRepository.getAttachmentById(attachmentId);
    if (!attachment) {
      throw new NotFoundError('Attachment does not exist');
    }
    await attachmentsRepository.deleteAttachment(attachmentId);
  }

  public async editAttachment(
    groupId: number,
    lessonId: number,
    attachmentId: number,
    name: string,
    url: string
  ): Promise<Attachment> {
    const lessonAttachments = await attachmentsRepository.getGroupLessonAttachment(
      lessonId,
      groupId
    );
    if (!lessonAttachments.some(attachment => attachment.id == attachmentId)) {
      throw new NotFoundError('Group, lesson or attachment does not exist');
    }

    const attachment = await attachmentsRepository.editAttachment(attachmentId, name, url);
    return { id: attachment.id, name: attachment.name, url: attachment.url };
  }
}
