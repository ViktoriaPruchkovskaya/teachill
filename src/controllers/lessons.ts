import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { LessonService } from '../services/education';
import { Validator, shouldHaveField, ValidationFailed } from '../validations';

export async function createLessonController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator([
    shouldHaveField('name', 'string'),
    shouldHaveField('typeId', 'number'),
    shouldHaveField('location', 'number'),
    shouldHaveField('startTime', 'string'),
    shouldHaveField('duration', 'number'),
  ]);
  try {
    validator.validate(ctx.request.body);
  } catch (err) {
    if (err instanceof ValidationFailed) {
      ctx.body = {
        errors: err.errors,
      };
      ctx.response.status = httpCodes.BAD_REQUEST;
      return await next();
    }
  }

  const lessonService = new LessonService();
  await lessonService.createLesson(
    ctx.request.body.name,
    ctx.request.body.typeId,
    ctx.request.body.location,
    ctx.request.body.startTime,
    ctx.request.body.duration,
    ctx.request.body.description
  );
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}
