import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { Validator, shouldHaveField, ValidationFailed, shouldMatchRegexp } from '../validations';
import { AttachmentService } from '../services/attachments';
import { NotFoundError } from '../errors';

interface AttachmentData {
  name: string;
  url: string;
}

export async function createAttachment(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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
      return next();
    }
  }

  const attachmentService = new AttachmentService();
  await attachmentService.createAttachment(validatedData.name, validatedData.url);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function assignToGroupLesson(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const attachmentService = new AttachmentService();
  try {
    await attachmentService.assignToGroupLesson(
      ctx.params.attachment_id,
      ctx.params.lesson_id,
      ctx.params.group_id
    );
    ctx.body = {};
    ctx.response.status = httpCodes.CREATED;
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return next();
    }
  }

  await next();
}

export async function getGroupLessonAttachment(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const attachmentService = new AttachmentService();
  try {
    const attachments = await attachmentService.getGroupLessonAttachment(
      ctx.params.lesson_id,
      ctx.params.group_id
    );
    ctx.body = [...attachments];
    ctx.response.status = httpCodes.OK;
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return next();
    }
  }

  await next();
}

export async function deleteGroupLessonAttachment(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const attachmentService = new AttachmentService();
  try {
    await attachmentService.deleteGroupLessonAttachment(
      ctx.params.attachment_id,
      ctx.params.lesson_id,
      ctx.params.group_id
    );
    ctx.body = {};
    ctx.response.status = httpCodes.OK;
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return next();
    }
  }

  await next();
}

export async function deleteAttachment(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const attachmentService = new AttachmentService();
  try {
    await attachmentService.deleteAttachment(ctx.params.id);
    ctx.body = {};
    ctx.response.status = httpCodes.OK;
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return next();
    }
  }

  await next();
}

export async function editAttachment(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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
      return next();
    }
  }

  const attachmentService = new AttachmentService();
  try {
    const attachment = await attachmentService.editAttachment(
      ctx.params.group_id,
      ctx.params.lesson_id,
      ctx.params.attachment_id,
      validatedData.name,
      validatedData.url
    );
    ctx.body = { ...attachment };
    ctx.response.status = httpCodes.OK;
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return next();
    }
  }

  await next();
}
