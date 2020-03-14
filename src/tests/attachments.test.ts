import { AttachmentService } from '../services/attachments';
import * as attachmentsRepository from '../repositories/attachments';
import * as lessonsRepository from '../repositories/lessons';
import * as attachmentsMocks from './mocks/attachments';
import { getGroupLessonById, getNonexistentGroupLessonById } from './mocks/lessons';

const mockedAttachments = attachmentsRepository as jest.Mocked<typeof attachmentsRepository>;
const mockedLessons = lessonsRepository as jest.Mocked<typeof lessonsRepository>;

describe('test attachments service', () => {
  it('test attachment creation', async () => {
    const NAME = 'attachment';
    const URL = 'https://attachment.com/4vd1o';
    const attachmentService = new AttachmentService();
    mockedAttachments.createAttachment = attachmentsMocks.createAttachment();

    await attachmentService.createAttachment(NAME, URL);

    expect(mockedAttachments.createAttachment).toBeCalledTimes(1);
  });

  it('test attachment assignment to lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getAttachmentById();
    mockedAttachments.assignToGroupLesson = attachmentsMocks.assignToGroupLesson();

    await attachmentService.assignToGroupLesson(ATTACHMENT_ID, LESSON_ID, GROUP_ID);

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.assignToGroupLesson).toBeCalledTimes(1);
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect((await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).id).toBe(ATTACHMENT_ID);
  });

  it('test attachment assignment to nonexistent lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getNonexistentGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getAttachmentById();
    mockedAttachments.assignToGroupLesson = attachmentsMocks.assignToGroupLesson();

    await expect(
      attachmentService.assignToGroupLesson(ATTACHMENT_ID, LESSON_ID, GROUP_ID)
    ).rejects.toThrow('Group, lesson or attachment does not exist');

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.assignToGroupLesson).not.toBeCalled();
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBeNull();
  });

  it('test nonexistent attachment assignment to lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getNonexistentAttachmentById();
    mockedAttachments.assignToGroupLesson = attachmentsMocks.assignToGroupLesson();

    await expect(
      attachmentService.assignToGroupLesson(ATTACHMENT_ID, LESSON_ID, GROUP_ID)
    ).rejects.toThrow('Group, lesson or attachment does not exist');

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.assignToGroupLesson).not.toBeCalled();
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect(await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).toBeNull();
  });

  it('test getting attachments of lesson group', async () => {
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getGroupLessonAttachment = attachmentsMocks.getAttachmentsArray();

    const attachments = await attachmentService.getGroupLessonAttachment(LESSON_ID, GROUP_ID);

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getGroupLessonAttachment).toBeCalledTimes(1);
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect(attachments).toEqual([
      { id: 1, name: 'attachment1', url: 'https://attachment.com/4vd1o' },
      { id: 2, name: 'attachment2', url: 'https://attachment.com/4voq' },
    ]);
  });

  it('test getting attachments of nonexistent lesson group', async () => {
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getNonexistentGroupLessonById();
    mockedAttachments.getGroupLessonAttachment = attachmentsMocks.getAttachmentsArray();

    await expect(attachmentService.getGroupLessonAttachment(LESSON_ID, GROUP_ID)).rejects.toThrow(
      'Group or lesson does not exist'
    );

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getGroupLessonAttachment).not.toBeCalled();
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBeNull();
  });

  it('test getting empty attachments array of lesson group', async () => {
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getGroupLessonAttachment = attachmentsMocks.getEmptyAttachmentsArray();

    const attachments = await attachmentService.getGroupLessonAttachment(LESSON_ID, GROUP_ID);

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getGroupLessonAttachment).toBeCalledTimes(1);
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect(attachments).toEqual([]);
  });

  it('test removing attachment from lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getAttachmentById();
    mockedAttachments.deleteGroupLessonAttachment = attachmentsMocks.deleteGroupLessonAttachment();

    await attachmentService.deleteGroupLessonAttachment(ATTACHMENT_ID, LESSON_ID, GROUP_ID);

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.deleteGroupLessonAttachment).toBeCalledTimes(1);
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect((await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).id).toBe(ATTACHMENT_ID);
  });

  it('test removing attachment from nonexistent lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getNonexistentGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getAttachmentById();
    mockedAttachments.deleteGroupLessonAttachment = attachmentsMocks.deleteGroupLessonAttachment();

    await expect(
      attachmentService.deleteGroupLessonAttachment(ATTACHMENT_ID, LESSON_ID, GROUP_ID)
    ).rejects.toThrow('Group, lesson or attachment does not exist');

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.deleteGroupLessonAttachment).not.toBeCalled();
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBeNull();
    expect((await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).id).toBe(ATTACHMENT_ID);
  });

  it('test removing nonexistent attachment from lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getNonexistentAttachmentById();
    mockedAttachments.deleteGroupLessonAttachment = attachmentsMocks.deleteGroupLessonAttachment();

    await expect(
      attachmentService.deleteGroupLessonAttachment(ATTACHMENT_ID, LESSON_ID, GROUP_ID)
    ).rejects.toThrow('Group, lesson or attachment does not exist');

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.deleteGroupLessonAttachment).not.toBeCalled();
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect(await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).toBeNull();
  });

  it('test removing attachment', async () => {
    const ATTACHMENT_ID = 6;
    const attachmentService = new AttachmentService();
    mockedAttachments.getAttachmentById = attachmentsMocks.getAttachmentById();
    mockedAttachments.deleteAttachment = attachmentsMocks.deleteAttachment();

    await attachmentService.deleteAttachment(ATTACHMENT_ID);

    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.deleteAttachment).toBeCalledTimes(1);
    expect((await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).id).toBe(ATTACHMENT_ID);
  });

  it('test removing nonexistent attachment', async () => {
    const ATTACHMENT_ID = 6;
    const attachmentService = new AttachmentService();
    mockedAttachments.getAttachmentById = attachmentsMocks.getNonexistentAttachmentById();
    mockedAttachments.deleteAttachment = attachmentsMocks.deleteAttachment();

    await expect(attachmentService.deleteAttachment(ATTACHMENT_ID)).rejects.toThrow(
      'Attachment does not exist'
    );

    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.deleteAttachment).not.toBeCalled();
    expect(await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).toBeNull();
  });
});
