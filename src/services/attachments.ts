import { createAttachment } from '../repositories/attachments';

export class AttachmentService {
  public async createAttachment(name: string, url: string): Promise<void> {
    return await createAttachment(name, url);
  }
}
