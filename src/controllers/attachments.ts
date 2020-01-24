import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { Validator, shouldHaveField, ValidationFailed } from '../validations';
import { AttachmentService } from '../services/attachments';

interface AttachmentData {
  name: string;
  url: string;
}

interface LessonAttachmentData {
  attachmentId: number;
}

export async function createAttachmentController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: AttachmentData;
  const validator = new Validator<AttachmentData>([
    shouldHaveField('name', 'string'),
    shouldHaveField('url', 'string'),
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

export async function createLessonAttachmentController(
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) {
  let validatedData: LessonAttachmentData;
  const validator = new Validator<LessonAttachmentData>([
    shouldHaveField('attachmentId', 'number'),
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
  await attachmentService.createLessonAttachment(ctx.params.lesson_id, validatedData.attachmentId);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function getLessonAttachmentsController(
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) {
  const attachmentService = new AttachmentService();
  const lessonAttachment = await attachmentService.getLessonAttachments(ctx.params.lesson_id);
  ctx.body = { ...lessonAttachment };
  ctx.response.status = httpCodes.OK;
  await next();
}
