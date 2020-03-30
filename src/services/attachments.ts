import * as attachmentsRepository from '../repositories/attachments';
import { getGroupLessonById } from '../repositories/lessons';
import { getMembershipById } from '../repositories/groups';
import { NotFoundError } from '../errors';
import { User } from './users';

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

  public async getLessonAttachments(lessonId: number, groupId: number): Promise<Attachment[]> {
    const lesson = await getGroupLessonById(groupId, lessonId);
    if (!lesson) {
      throw new NotFoundError('Group or lesson does not exist');
    }

    const attachments = await attachmentsRepository.getLessonAttachments(lessonId, groupId);
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
    if (!attachment || currentGroup !== attachment.groupId) {
      throw new NotFoundError('Attachment not found');
    }

    return {
      id: attachment.id,
      name: attachment.name,
      url: attachment.url,
      groupId: attachment.groupId,
    };
  }
}
