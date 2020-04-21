import * as attachmentsRepository from '../repositories/attachments';
import { getGroupLessonById } from '../repositories/lessons';
import { getMembershipById } from '../repositories/groups';
import { NotFoundError } from '../errors';
import { User } from './users';
import { Group } from './groups';

export interface Attachment {
  id: number;
  name: string;
  url: string;
  groupId: number;
}

interface UpdateAttachment {
  name?: string;
  url?: string;
}

export class AttachmentService {
  public async createAttachment(name: string, url: string): Promise<number> {
    return attachmentsRepository.createAttachment(name, url);
  }

  public async assignAttachmentToLesson(
    currentUser: User,
    attachmentId: number,
    lessonId: number
  ): Promise<void> {
    const group = await this.getGroupIfLessonExist(currentUser.id, lessonId);
    const attachment = await attachmentsRepository.getAttachmentById(attachmentId);
    if (!attachment) {
      throw new NotFoundError('Attachment not found');
    }

    return attachmentsRepository.assignAttachmentToLesson(attachmentId, lessonId, group.id);
  }

  public async getLessonAttachments(currentUser: User, lessonId: number): Promise<Attachment[]> {
    const group = await this.getGroupIfLessonExist(currentUser.id, lessonId);

    const attachments = await attachmentsRepository.getLessonAttachments(lessonId, group.id);
    return attachments.map(attachment => ({
      id: attachment.id,
      name: attachment.name,
      url: attachment.url,
      groupId: attachment.groupId,
    }));
  }

  public async deleteAttachment(currentUser: User, attachmentId: number): Promise<void> {
    const attachment = await this.getAttachmentIfCommon(currentUser.id, attachmentId);
    await attachmentsRepository.deleteAttachment(attachment.id, attachment.groupId);
  }

  public async getAttachment(currentUser: User, attachmentId: number): Promise<Attachment> {
    return await this.getAttachmentIfCommon(currentUser.id, attachmentId);
  }

  public async editAttachment(
    currentUser: User,
    attachmentId: number,
    attachmentInfo: UpdateAttachment
  ): Promise<Attachment> {
    let attachment = await this.getAttachmentIfCommon(currentUser.id, attachmentId);

    attachment = Object.assign(attachment, attachmentInfo);

    const changedAttachment = await attachmentsRepository.editAttachment(attachmentId, attachment);
    return {
      id: changedAttachment.id,
      name: changedAttachment.name,
      url: changedAttachment.url,
      groupId: changedAttachment.groupId,
    };
  }

  private async getAttachmentIfCommon(
    currentUserId: number,
    attachmentId: number
  ): Promise<Attachment> {
    const currentGroup = await getMembershipById(currentUserId);
    const attachment = await attachmentsRepository.getAttachmentById(attachmentId);
    if (!attachment || currentGroup.id !== attachment.groupId) {
      throw new NotFoundError('Attachment not found');
    }

    return {
      id: attachment.id,
      name: attachment.name,
      url: attachment.url,
      groupId: attachment.groupId,
    };
  }

  private async getGroupIfLessonExist(userId: number, lessonId: number): Promise<Group> {
    const currentGroup = await getMembershipById(userId);
    const lesson = await getGroupLessonById(currentGroup.id, lessonId);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }
    return { id: currentGroup.id, name: currentGroup.name };
  }
}
