import { StorageService } from './storageService';
import { LessonClient } from '../clients/lessonClient';

interface UpdateLessonPayload {
  id: number;
  description: string;
}

export class LessonService {
  private storageService: StorageService;
  private lessonClient: LessonClient;

  constructor() {
    this.storageService = new StorageService();
    const token = this.storageService.getToken();
    this.lessonClient = new LessonClient(token);
  }

  public async updateLesson(payload: UpdateLessonPayload): Promise<void> {
    return this.lessonClient.updateLesson(payload);
  }
}
