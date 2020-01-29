import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { Validator, shouldHaveField, ValidationFailed, shouldMatchRegexp } from '../validations';
import { AttachmentService, Attachment } from '../services/attachments';
import { NotFoundError } from '../errors';

interface AttachmentData {
  name: string;
  url: string;
}

export async function createAttachmentController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: AttachmentData;
  const validator = new Validator<AttachmentData>([
    shouldHaveField('name', 'string'),
    shouldHaveField('url', 'string'),
    shouldMatchRegexp(
      'url',
      '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
    ),
  ]);
  try {
    validatedData = validator.validate(ctx.request.body);
  } catch (err) {
    if (err instanceof ValidationFailed) {
      ctx.body = {
        errors: err.errors,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }

  const attachmentService = new AttachmentService();
  await attachmentService.createAttachment(validatedData.name, validatedData.url);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function assignToGroupLessonController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const attachmentService = new AttachmentService();
  try {
    await attachmentService.assignToGroupLesson(
      ctx.params.attachment_id,
      ctx.params.lesson_id,
      ctx.params.group_id
    );
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }

  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function getGroupLessonAttachmentController(
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) {
  const attachmentService = new AttachmentService();
  let attachments: Attachment[];
  try {
    attachments = await attachmentService.getGroupLessonAttachment(
      ctx.params.lesson_id,
      ctx.params.group_id
    );
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }

  ctx.body = [...attachments];
  ctx.response.status = httpCodes.OK;
  await next();
}
