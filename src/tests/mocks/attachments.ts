import { RawAttachment } from '../../repositories/attachments';

export const createAttachment = () => jest.fn((name: string, url: string) => Promise.resolve(1));

export const getAttachmentById = () =>
  jest.fn((id: number) =>
    Promise.resolve({ id: id, name: 'attachment', url: 'https://attachment.com/4vd1o', groupId: 2 })
  );

export const assignAttachmentToLesson = () =>
  jest.fn((attachmentId: number, lessonId: number, groupId: number) => Promise.resolve());

export const getNonexistentAttachmentById = () => jest.fn((id: number) => Promise.resolve(null));

export const getAttachmentsArray = () =>
  jest.fn((lessonId: number, groupId: number) =>
    Promise.resolve([
      { id: 1, name: 'attachment1', url: 'https://attachment.com/4vd1o', groupId: 2 },
      { id: 2, name: 'attachment2', url: 'https://attachment.com/4voq', groupId: 2 },
    ])
  );

export const getEmptyAttachmentsArray = () =>
  jest.fn((lessonId: number, groupId: number) => Promise.resolve([]));

export const deleteAttachment = () =>
  jest.fn((attachmentId: number, groupId: number) => Promise.resolve());

export const editAttachment = () =>
  jest.fn((attachmentId: number, rawAttachment: RawAttachment) =>
    Promise.resolve({
      id: attachmentId,
      name: rawAttachment.name,
      url: rawAttachment.url,
      groupId: 2,
    })
  );

export const attachmentInGroup = () =>
  jest.fn((attachmentId: number, groupId: number) =>
    Promise.resolve({ id: attachmentId, name: 'attachment', url: 'https://attachment.com/4vd1o' })
  );

export const NonexistentAttachmentInGroup = () =>
  jest.fn((attachmentId: number, groupId: number) => Promise.resolve(null));

export const getAttachmentIfCommon = (currentGroup: number, attachmentGroup: number) =>
  jest.fn((userId: number, attachmentId: number) => {
    if (currentGroup !== attachmentGroup) {
      throw new Error('Attachment not found');
    }
    return Promise.resolve({
      id: attachmentId,
      name: 'attachment',
      url: 'https://attachment.com/4vd1o',
      groupId: attachmentGroup,
    });
  });

export const getGroupIfLessonExist = (groupId: number, getGroupLessonById) =>
  jest.fn(async (userId: number, lessonId) => {
    const lesson = await getGroupLessonById()(groupId, lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return Promise.resolve(groupId);
  });
