import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface DBAttachment {
  id: number;
  name: string;
  url: string;
}

export async function createAttachment(name: string, url: string): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`INSERT INTO attachments (name, url) VALUES (${name}, ${url})`);
  });
}

export async function assignToGroupLesson(
  attachmentId: number,
  lessonId: number,
  groupId: number
): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
    INSERT INTO group_lesson_attachments (attachment_id, lesson_id, group_id) VALUES (${attachmentId}, ${lessonId}, ${groupId})`);
  });
}

export async function getGroupLessonAttachment(
  lessonId: number,
  groupId: number
): Promise<DBAttachment[]> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.any(sql`
      SELECT id, name, url
      FROM attachments
      JOIN group_lesson_attachments on attachments.id = attachment_id
      WHERE lesson_id = ${lessonId} AND group_id = ${groupId}
      `);

    return row.map(attachment => ({
      id: attachment.id as number,
      name: attachment.name as string,
      url: attachment.url as string,
    }));
  });
}

export async function getAttachmentById(attachmentId: number): Promise<DBAttachment | null> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(
      sql`SELECT id, name, url FROM attachments WHERE id=${attachmentId}`
    );
    if (row) {
      return {
        id: row.id as number,
        name: row.name as string,
        url: row.url as string,
      };
    }
    return null;
  });
}

export async function deleteGroupLessonAttachment(
  attachmentId: number,
  lessonId: number,
  groupId: number
): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
      DELETE
      FROM group_lesson_attachments
      WHERE attachment_id = ${attachmentId} AND lesson_id = ${lessonId} AND group_id = ${groupId};`);
  });
}

export async function deleteAttachment(attachmentId: number): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
    DELETE
    FROM attachments
    WHERE id = ${attachmentId};`);
  });
}
