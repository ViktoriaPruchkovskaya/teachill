import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import {
  Validator,
  shouldHaveField,
  shouldMatchRegexp,
  mayHaveFields,
  optionalFieldShouldHaveType,
} from '../validations';
import { AttachmentService } from '../services/attachments';
import { State } from '../state';

interface AttachmentData {
  name: string;
  url: string;
}

interface UpdateAttachmentData {
  name?: string;
  url?: string;
}

export async function createAttachment(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<AttachmentData>([
    shouldHaveField('name', 'string'),
    shouldHaveField('url', 'string'),
    shouldMatchRegexp(
      'url',
      '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
    ),
  ]);
  const validatedData = validator.validate(ctx.request.body);

  const attachmentService = new AttachmentService();
  const attachmentId = await attachmentService.createAttachment(
    validatedData.name,
    validatedData.url
  );
  ctx.body = { attachmentId };
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function assignAttachmentToLesson(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const attachmentService = new AttachmentService();
  await attachmentService.assignAttachmentToLesson(
    ctx.state.user,
    ctx.params.attachment_id,
    ctx.params.lesson_id
  );
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;

  await next();
}

export async function getLessonAttachments(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const attachmentService = new AttachmentService();
  const attachments = await attachmentService.getLessonAttachments(
    ctx.state.user,
    ctx.params.lesson_id
  );
  ctx.body = [...attachments];
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function deleteAttachment(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const attachmentService = new AttachmentService();
  await attachmentService.deleteAttachment(ctx.state.user, ctx.params.attachment_id);
  ctx.body = {};
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function getAttachment(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const attachmentService = new AttachmentService();
  const attachment = await attachmentService.getAttachment(
    ctx.state.user,
    ctx.params.attachment_id
  );
  ctx.body = { ...attachment };
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function editAttachment(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const validator = new Validator<UpdateAttachmentData>([
    mayHaveFields(['name', 'url']),
    optionalFieldShouldHaveType('name', 'string'),
    optionalFieldShouldHaveType('url', 'string'),
    shouldMatchRegexp(
      'url',
      '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
    ),
  ]);
  const validatedData = validator.validate(ctx.request.body);

  const attachmentService = new AttachmentService();
  const attachment = await attachmentService.editAttachment(
    ctx.state.user,
    ctx.params.attachment_id,
    validatedData
  );
  ctx.body = { ...attachment };
  ctx.response.status = httpCodes.OK;

  await next();
}
