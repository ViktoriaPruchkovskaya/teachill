import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface DBAttachment {
  id: number;
  name: string;
  url: string;
}

export async function createAttachment(name: string, url: string): Promise<void> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`INSERT INTO attachments (name, url) VALUES (${name}, ${url})`);
  });
}

export async function assignToGroupLesson(attachmentId: number, lessonId: number, groupId: number) {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
    INSERT INTO group_lesson_attachments (attachment_id, lesson_id, group_id) VALUES (${attachmentId}, ${lessonId}, ${groupId})`);
  });
}

export async function getGroupLessonAttachment(
  lessonId: number,
  groupId: number
): Promise<DBAttachment[]> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.many(sql`
    SELECT id, name, url
    FROM attachments
    JOIN group_lesson_attachments on attachments.id = attachment_id
    WHERE lesson_id = ${lessonId} AND group_id = ${groupId}`);
    const attachments: DBAttachment[] = row.map(attachment => {
      const res: DBAttachment = {
        id: attachment.id as number,
        name: attachment.name as string,
        url: attachment.url as string,
      };
      return res;
    });
    return attachments;
  });
}

export async function getAttachmentById(attachmentId: number): Promise<string | null> {
  return await DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(
      sql`SELECT name FROM attachments WHERE id=${attachmentId}`
    );
    if (row) {
      return row.name as string;
    }
    return null;
  });
}
