import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as multer from '@koa/multer';

export interface FileUploadService {
  upload(file: multer.File): Promise<string>;
}

export class LocalFileUploadService implements FileUploadService {
  public static DEFAULT_UPLOAD_PATH = 'uploads/';

  public async upload(file: multer.File): Promise<string> {
    await this.createPathIfNotExists(LocalFileUploadService.DEFAULT_UPLOAD_PATH);
    const fileName = this.generateName(file);
    const filePath = `${LocalFileUploadService.DEFAULT_UPLOAD_PATH}${fileName}`;
    await fs.promises.writeFile(filePath, file.buffer);
    return filePath;
  }

  private async createPathIfNotExists(path: string) {
    try {
      await fs.promises.stat(path);
    } catch (e) {
      await fs.promises.mkdir(path, {
        recursive: true,
      });
    }
  }

  private generateName(file: multer.File): string {
    const hash = crypto.createHash('md5');
    hash.update(file.originalname);
    hash.update(new Date().toString());
    const extension = path.extname(file.originalname);
    return `${hash.digest('hex').toString()}${extension}`;
  }
}
