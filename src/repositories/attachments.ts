import { DatabaseConnection } from '../db/connection';
import { sql } from 'slonik';

interface DBAttachment {
  id: number;
  name: string;
  url: string;
  groupId: number | null;
}

export interface RawAttachment {
  id: number;
  name: string;
  url: string;
}

interface GroupAttachment {
  attachmentId: number;
  lessonId: number;
  name: string;
  url: string;
}

export async function createAttachment(name: string, url: string): Promise<number> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const attachment = await connection.one(
      sql`INSERT INTO attachments (name, url) VALUES (${name}, ${url}) RETURNING id`
    );
    return attachment.id as number;
  });
}

export async function assignAttachmentToLesson(
  attachmentId: number,
  lessonId: number,
  groupId: number
): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.query(sql`
    INSERT INTO group_lesson_attachments (attachment_id, lesson_id, group_id) VALUES (${attachmentId}, ${lessonId}, ${groupId})`);
  });
}

export async function getLessonAttachments(
  lessonId: number,
  groupId: number
): Promise<DBAttachment[]> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.any(sql`
      SELECT id, name, url, group_id
      FROM attachments
      JOIN group_lesson_attachments on attachments.id = attachment_id
      WHERE lesson_id = ${lessonId} AND group_id = ${groupId}
      `);

    return row.map(attachment => ({
      id: attachment.id as number,
      name: attachment.name as string,
      url: attachment.url as string,
      groupId: attachment.group_id as number,
    }));
  });
}

export async function getAttachmentById(attachmentId: number): Promise<DBAttachment | null> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const row = await connection.maybeOne(sql`
    SELECT attachments.id, attachments.name, attachments.url, group_lesson_attachments.group_id
    FROM attachments
    LEFT JOIN group_lesson_attachments  on attachments.id = attachment_id
    WHERE attachments.id = ${attachmentId}`);
    if (row) {
      return {
        id: row.id as number,
        name: row.name as string,
        url: row.url as string,
        groupId: row.group_id as number | null,
      };
    }
    return null;
  });
}

export async function deleteAttachment(attachmentId: number, groupId: number): Promise<void> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    await connection.transaction(async transaction => {
      await transaction.query(sql`
      DELETE
      FROM group_lesson_attachments
      WHERE attachment_id = ${attachmentId} AND group_id = ${groupId}`);

      await transaction.query(sql`
      DELETE
      FROM attachments
      WHERE id = ${attachmentId}`);
    });
  });
}

export async function editAttachment(
  id: number,
  rowAttachment: RawAttachment
): Promise<DBAttachment> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const attachment = await connection.one(sql`
      UPDATE attachments
      SET name = ${rowAttachment.name},
          url =  ${rowAttachment.url}
      FROM group_lesson_attachments
      WHERE id = ${id} AND  id = group_lesson_attachments.attachment_id
      RETURNING id, name, url, group_id`);
    return {
      id: attachment.id as number,
      name: attachment.name as string,
      url: attachment.url as string,
      groupId: attachment.group_id as number,
    };
  });
}

export async function getGroupAttachments(groupId: number): Promise<GroupAttachment[]> {
  return DatabaseConnection.getConnectionPool().connect(async connection => {
    const rows = await connection.any(sql`
    SELECT attachment_id, lesson_id, name, url
    FROM group_lesson_attachments
    INNER JOIN attachments on group_lesson_attachments.attachment_id = id
    WHERE group_id= ${groupId}
    `);

    return rows.map(attachment => ({
      attachmentId: attachment.attachment_id as number,
      lessonId: attachment.lesson_id as number,
      name: attachment.name as string,
      url: attachment.url as string,
    }));
  });
}
