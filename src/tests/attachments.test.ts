import { AttachmentService } from '../services/attachments';
import * as attachmentsRepository from '../repositories/attachments';
import * as lessonsRepository from '../repositories/lessons';
import * as groupsRepository from '../repositories/groups';
import * as attachmentsMocks from './mocks/attachments';
import { getGroupLessonById, getNonexistentGroupLessonById } from './mocks/lessons';
import { getMembershipById } from './mocks/groups';

const mockedAttachments = attachmentsRepository as jest.Mocked<typeof attachmentsRepository>;
const mockedLessons = lessonsRepository as jest.Mocked<typeof lessonsRepository>;
const mockedGroups = groupsRepository as jest.Mocked<typeof groupsRepository>;

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
    mockedAttachments.getGroupLessonAttachments = attachmentsMocks.getAttachmentsArray();

    const attachments = await attachmentService.getGroupLessonAttachment(LESSON_ID, GROUP_ID);

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getGroupLessonAttachments).toBeCalledTimes(1);
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect(attachments).toEqual([
      { id: 1, name: 'attachment1', url: 'https://attachment.com/4vd1o', groupId: 2 },
      { id: 2, name: 'attachment2', url: 'https://attachment.com/4voq', groupId: 2 },
    ]);
  });

  it('test getting attachments of nonexistent lesson group', async () => {
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getNonexistentGroupLessonById();
    mockedAttachments.getGroupLessonAttachments = attachmentsMocks.getAttachmentsArray();

    await expect(attachmentService.getGroupLessonAttachment(LESSON_ID, GROUP_ID)).rejects.toThrow(
      'Group or lesson does not exist'
    );

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getGroupLessonAttachments).not.toBeCalled();
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBeNull();
  });

  it('test getting empty attachments array of lesson group', async () => {
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getGroupLessonAttachments = attachmentsMocks.getEmptyAttachmentsArray();

    const attachments = await attachmentService.getGroupLessonAttachment(LESSON_ID, GROUP_ID);

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getGroupLessonAttachments).toBeCalledTimes(1);
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect(attachments).toEqual([]);
  });

  it('test removing attachment from lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedAttachments.getGroupLessonAttachments = attachmentsMocks.getAttachmentsArray();
    mockedAttachments.deleteGroupLessonAttachment = attachmentsMocks.deleteGroupLessonAttachment();

    await attachmentService.deleteGroupLessonAttachment(ATTACHMENT_ID, LESSON_ID, GROUP_ID);

    expect(mockedAttachments.getGroupLessonAttachments).toBeCalledTimes(1);
    expect(mockedAttachments.deleteGroupLessonAttachment).toBeCalledTimes(1);
    expect(await mockedAttachments.getGroupLessonAttachments(LESSON_ID, GROUP_ID)).toEqual([
      { id: 1, name: 'attachment1', url: 'https://attachment.com/4vd1o', groupId: 2 },
      { id: 2, name: 'attachment2', url: 'https://attachment.com/4voq', groupId: 2 },
    ]);
  });

  it('test removing attachment from nonexistent lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedAttachments.getGroupLessonAttachments = attachmentsMocks.getEmptyAttachmentsArray();
    mockedAttachments.deleteGroupLessonAttachment = attachmentsMocks.deleteGroupLessonAttachment();

    await expect(
      attachmentService.deleteGroupLessonAttachment(ATTACHMENT_ID, LESSON_ID, GROUP_ID)
    ).rejects.toThrow('Group, lesson or attachment does not exist');

    expect(mockedAttachments.getGroupLessonAttachments).toBeCalledTimes(1);
    expect(mockedAttachments.deleteGroupLessonAttachment).not.toBeCalled();
    expect(await mockedAttachments.getGroupLessonAttachments(LESSON_ID, GROUP_ID)).toEqual([]);
  });

  it('test removing nonexistent attachment from lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedAttachments.getGroupLessonAttachments = attachmentsMocks.getEmptyAttachmentsArray();
    mockedAttachments.deleteGroupLessonAttachment = attachmentsMocks.deleteGroupLessonAttachment();

    await expect(
      attachmentService.deleteGroupLessonAttachment(ATTACHMENT_ID, LESSON_ID, GROUP_ID)
    ).rejects.toThrow('Group, lesson or attachment does not exist');

    expect(mockedAttachments.getGroupLessonAttachments).toBeCalledTimes(1);
    expect(mockedAttachments.deleteGroupLessonAttachment).not.toBeCalled();
    expect(await mockedAttachments.getGroupLessonAttachments(GROUP_ID, LESSON_ID)).toEqual([]);
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

  it('test attachment update', async () => {
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const ATTACHMENT_ID = 1;
    const ATTACHMENT_INFO = {
      name: 'attachment',
      url: 'https://attachment.com/',
    };
    const attachmentService = new AttachmentService();
    mockedGroups.getMembershipById = getMembershipById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getAttachmentById();
    mockedAttachments.editAttachment = attachmentsMocks.editAttachment();

    const attachment = await attachmentService.editAttachment(
      CURRENT_USER,
      ATTACHMENT_ID,
      ATTACHMENT_INFO
    );

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.editAttachment).toBeCalledTimes(1);
    expect((await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).id).toEqual(ATTACHMENT_ID);
    expect(attachment).toEqual({
      id: ATTACHMENT_ID,
      name: ATTACHMENT_INFO.name,
      url: ATTACHMENT_INFO.url,
      groupId: 2,
    });
  });

  it('test update attachment which not exist in current group', async () => {
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const ATTACHMENT_ID = 2;
    const ATTACHMENT_INFO = {
      name: 'attachment',
      url: 'https://attachment.com/',
    };
    const attachmentService = new AttachmentService();
    mockedGroups.getMembershipById = getMembershipById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getNonexistentAttachmentById();
    mockedAttachments.editAttachment = attachmentsMocks.editAttachment();

    await expect(
      attachmentService.editAttachment(CURRENT_USER, ATTACHMENT_ID, ATTACHMENT_INFO)
    ).rejects.toThrow('Attachment not found');

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.editAttachment).not.toBeCalled();
    expect(await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).toBeNull();
  });
});
