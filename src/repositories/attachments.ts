import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface LessonAttachment {
  name: string;
  url: string;
}

export async function createAttachment(name: string, url: string): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`INSERT INTO attachments (name, url) VALUES (${name}, ${url})`);
  });
}

export async function createLessonAttachment(
  lessonId: number,
  attachmentId: number
): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
      INSERT INTO lesson_attachments (lesson_id, attachment_id) VALUES (${lessonId}, ${attachmentId})`);
  });
}

export async function getLessonAttachments(lessonId: number): Promise<LessonAttachment[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.many(sql`
      SELECT name, url
      FROM attachments
      JOIN lesson_attachments on attachments.id = lesson_attachments.attachment_id
      WHERE lesson_id = ${lessonId}
    `);
    const lessonAttachments: LessonAttachment[] = rows.map(attachment => {
      const res: LessonAttachment = {
        name: attachment.name as string,
        url: attachment.url as string,
      };
      return res;
    });
    return lessonAttachments;
  });
}
