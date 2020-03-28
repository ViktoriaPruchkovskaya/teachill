import { RawAttachment } from '../../repositories/attachments';

export const createAttachment = () => jest.fn((name: string, url: string) => Promise.resolve());

export const getAttachmentById = () =>
  jest.fn((id: number) =>
    Promise.resolve({ id: id, name: 'attachment', url: 'https://attachment.com/4vd1o' })
  );

export const assignToGroupLesson = () =>
  jest.fn((attachmentId: number, lessonId: number, groupId: number) => Promise.resolve());

export const getNonexistentAttachmentById = () => jest.fn((id: number) => Promise.resolve(null));

export const getAttachmentsArray = () =>
  jest.fn((lessonId: number, groupId: number) =>
    Promise.resolve([
      { id: 1, name: 'attachment1', url: 'https://attachment.com/4vd1o' },
      { id: 2, name: 'attachment2', url: 'https://attachment.com/4voq' },
    ])
  );

export const getEmptyAttachmentsArray = () =>
  jest.fn((lessonId: number, groupId: number) => Promise.resolve([]));

export const deleteGroupLessonAttachment = () =>
  jest.fn((attachmentId: number, lessonId: number, groupId: number) => Promise.resolve());

export const deleteAttachment = () => jest.fn((attachmentId: number) => Promise.resolve());

export const editAttachment = () =>
  jest.fn((attachmentId: number, rawAttachment: RawAttachment) =>
    Promise.resolve({ id: attachmentId, name: rawAttachment.name, url: rawAttachment.url })
  );

export const attachmentInGroup = () =>
  jest.fn((attachmentId: number, groupId: number) =>
    Promise.resolve({ id: attachmentId, name: 'attachment', url: 'https://attachment.com/4vd1o' })
  );

export const NonexistentAttachmentInGroup = () =>
  jest.fn((attachmentId: number, groupId: number) => Promise.resolve(null));
