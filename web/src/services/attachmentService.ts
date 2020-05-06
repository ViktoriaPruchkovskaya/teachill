import { StorageService } from './storageService';
import { AttachmentClient } from '../clients/attachmentClient';

interface LessonAttachmentPayload {
  lessonId: number;
  name: string;
  url: string;
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
}

export class AttachmentService {
  private storageService: StorageService;
  private attachmentClient: AttachmentClient;

  constructor() {
    this.storageService = new StorageService();
    const token = this.storageService.getToken();
    this.attachmentClient = new AttachmentClient(token);
  }

  public async createAttachment(payload: LessonAttachmentPayload): Promise<number> {
    const attachmentId = await this.attachmentClient.createAttachment(payload);
    await this.attachmentClient.assignAttachment(payload.lessonId, attachmentId);
    return attachmentId;
  }

  public async deleteAttachment(attachmentId: number): Promise<boolean> {
    await this.attachmentClient.deleteAttachment(attachmentId);
    return true;
  }

  public async getLessonAttachments(lessonId: number): Promise<Attachment[]> {
    const attachments = await this.attachmentClient.getLessonAttachments(lessonId);
    return attachments.map(attachment => ({
      id: attachment.id,
      name: attachment.name,
      url: attachment.url,
    }));
  }
}
