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

    const attachmentId = await attachmentService.createAttachment(NAME, URL);

    expect(mockedAttachments.createAttachment).toBeCalledTimes(1);
    expect(attachmentId).toBe(1);
  });

  it('test attachment assignment to lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getAttachmentById();
    mockedAttachments.assignAttachmentToLesson = attachmentsMocks.assignAttachmentToLesson();
    mockedGroups.getMembershipById = getMembershipById();

    await attachmentService.assignAttachmentToLesson(CURRENT_USER, ATTACHMENT_ID, LESSON_ID);

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.assignAttachmentToLesson).toBeCalledTimes(1);
    expect(
      await mockedLessons.getGroupLessonById(
        await mockedGroups.getMembershipById(CURRENT_USER.id),
        LESSON_ID
      )
    ).toBe(LESSON_ID);
    expect((await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).id).toBe(ATTACHMENT_ID);
  });

  it('test attachment assignment to nonexistent lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getNonexistentGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getAttachmentById();
    mockedAttachments.assignAttachmentToLesson = attachmentsMocks.assignAttachmentToLesson();
    mockedGroups.getMembershipById = getMembershipById();

    await expect(
      attachmentService.assignAttachmentToLesson(CURRENT_USER, ATTACHMENT_ID, LESSON_ID)
    ).rejects.toThrow('Group, lesson or attachment does not exist');

    expect(mockedGroups.getMembershipById).toBeCalledTimes(1);
    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.assignAttachmentToLesson).not.toBeCalled();
    expect(
      await mockedLessons.getGroupLessonById(
        await mockedGroups.getMembershipById(CURRENT_USER.id),
        LESSON_ID
      )
    ).toBeNull();
  });

  it('test nonexistent attachment assignment to lesson group', async () => {
    const ATTACHMENT_ID = 1;
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getAttachmentById = attachmentsMocks.getNonexistentAttachmentById();
    mockedAttachments.assignAttachmentToLesson = attachmentsMocks.assignAttachmentToLesson();

    await expect(
      attachmentService.assignAttachmentToLesson(CURRENT_USER, ATTACHMENT_ID, LESSON_ID)
    ).rejects.toThrow('Group, lesson or attachment does not exist');

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getAttachmentById).toBeCalledTimes(1);
    expect(mockedAttachments.assignAttachmentToLesson).not.toBeCalled();
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect(await mockedAttachments.getAttachmentById(ATTACHMENT_ID)).toBeNull();
  });

  it('test getting attachments of lesson group', async () => {
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getLessonAttachments = attachmentsMocks.getAttachmentsArray();

    const attachments = await attachmentService.getLessonAttachments(LESSON_ID, GROUP_ID);

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getLessonAttachments).toBeCalledTimes(1);
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
    mockedAttachments.getLessonAttachments = attachmentsMocks.getAttachmentsArray();

    await expect(attachmentService.getLessonAttachments(LESSON_ID, GROUP_ID)).rejects.toThrow(
      'Group or lesson does not exist'
    );

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getLessonAttachments).not.toBeCalled();
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBeNull();
  });

  it('test getting empty attachments array of lesson group', async () => {
    const LESSON_ID = 6;
    const GROUP_ID = 5;
    const attachmentService = new AttachmentService();
    mockedLessons.getGroupLessonById = getGroupLessonById();
    mockedAttachments.getLessonAttachments = attachmentsMocks.getEmptyAttachmentsArray();

    const attachments = await attachmentService.getLessonAttachments(LESSON_ID, GROUP_ID);

    expect(mockedLessons.getGroupLessonById).toBeCalledTimes(1);
    expect(mockedAttachments.getLessonAttachments).toBeCalledTimes(1);
    expect(await mockedLessons.getGroupLessonById(GROUP_ID, LESSON_ID)).toBe(LESSON_ID);
    expect(attachments).toEqual([]);
  });

  it('test removing attachment from group', async () => {
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const CURRENT_GROUP = 2;
    const ATTACHMENT_ID = 6;
    const ATTACHMENT_GROUP = 2;
    const attachmentService = new AttachmentService();
    (attachmentService as any).getAttachmentIfCommon = attachmentsMocks.getAttachmentIfCommon(
      CURRENT_GROUP,
      ATTACHMENT_GROUP
    );
    mockedAttachments.deleteAttachment = attachmentsMocks.deleteAttachment();

    await attachmentService.deleteAttachment(CURRENT_USER, ATTACHMENT_ID);

    expect((attachmentService as any).getAttachmentIfCommon).toBeCalledTimes(1);
    expect(mockedAttachments.deleteAttachment).toBeCalledTimes(1);
    expect(
      (await (attachmentService as any).getAttachmentIfCommon(CURRENT_USER.id, ATTACHMENT_ID)).id
    ).toBe(ATTACHMENT_ID);
  });

  it('test remove attachment, which does not exist in current group', async () => {
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const CURRENT_GROUP = 4;
    const ATTACHMENT_ID = 6;
    const ATTACHMENT_GROUP = 2;
    const attachmentService = new AttachmentService();
    (attachmentService as any).getAttachmentIfCommon = attachmentsMocks.getAttachmentIfCommon(
      CURRENT_GROUP,
      ATTACHMENT_GROUP
    );
    mockedAttachments.deleteAttachment = attachmentsMocks.deleteAttachment();

    expect(() =>
      (attachmentService as any).getAttachmentIfCommon(CURRENT_USER.id, ATTACHMENT_ID)
    ).toThrow('Attachment not found');
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
    const CURRENT_GROUP = 2;
    const ATTACHMENT_GROUP = 2;
    const attachmentService = new AttachmentService();
    (attachmentService as any).getAttachmentIfCommon = attachmentsMocks.getAttachmentIfCommon(
      CURRENT_GROUP,
      ATTACHMENT_GROUP
    );
    mockedAttachments.editAttachment = attachmentsMocks.editAttachment();

    const attachment = await attachmentService.editAttachment(
      CURRENT_USER,
      ATTACHMENT_ID,
      ATTACHMENT_INFO
    );

    expect((attachmentService as any).getAttachmentIfCommon).toBeCalledTimes(1);
    expect(mockedAttachments.editAttachment).toBeCalledTimes(1);
    expect(
      (await (attachmentService as any).getAttachmentIfCommon(CURRENT_USER.id, ATTACHMENT_ID)).id
    ).toEqual(ATTACHMENT_ID);
    expect(attachment).toEqual({
      id: ATTACHMENT_ID,
      name: ATTACHMENT_INFO.name,
      url: ATTACHMENT_INFO.url,
      groupId: 2,
    });
  });

  it('test update attachment which does not exist in current group', async () => {
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
    const CURRENT_GROUP = 6;
    const ATTACHMENT_GROUP = 2;
    const attachmentService = new AttachmentService();
    (attachmentService as any).getAttachmentIfCommon = attachmentsMocks.getAttachmentIfCommon(
      CURRENT_GROUP,
      ATTACHMENT_GROUP
    );

    expect(() =>
      (attachmentService as any).getAttachmentIfCommon(CURRENT_USER.id, ATTACHMENT_ID)
    ).toThrow('Attachment not found');
  });

  it('test attachment displaying', async () => {
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const CURRENT_GROUP = 2;
    const ATTACHMENT_GROUP = 2;
    const ATTACHMENT_ID = 2;
    const attachmentService = new AttachmentService();
    (attachmentService as any).getAttachmentIfCommon = attachmentsMocks.getAttachmentIfCommon(
      CURRENT_GROUP,
      ATTACHMENT_GROUP
    );

    const attachment = await attachmentService.getAttachment(CURRENT_USER, ATTACHMENT_ID);

    expect(Object.keys(attachment)).toEqual(['id', 'name', 'url', 'groupId']);
  });

  it('test display attachment which does not exist in current group', async () => {
    const CURRENT_USER = {
      id: 1,
      username: 'user',
      fullName: 'useruser',
      role: 1,
    };
    const CURRENT_GROUP = 8;
    const ATTACHMENT_GROUP = 2;
    const ATTACHMENT_ID = 2;
    const attachmentService = new AttachmentService();
    (attachmentService as any).getAttachmentIfCommon = attachmentsMocks.getAttachmentIfCommon(
      CURRENT_GROUP,
      ATTACHMENT_GROUP
    );

    expect(() =>
      (attachmentService as any).getAttachmentIfCommon(CURRENT_USER.id, ATTACHMENT_ID)
    ).toThrow('Attachment not found');
  });
});
