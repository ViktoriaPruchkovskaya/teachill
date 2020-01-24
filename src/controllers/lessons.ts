import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { LessonService } from '../services/lessons';
import { Validator, shouldHaveField, ValidationFailed, minLengthShouldBe } from '../validations';

interface LessonData {
  name: string;
  typeId: number;
  location: number;
  startTime: string;
  duration: number;
  description?: string;
}

export async function createLessonController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: LessonData;
  const validator = new Validator<LessonData>([
    shouldHaveField('name', 'string'),
    shouldHaveField('typeId', 'number'),
    shouldHaveField('location', 'number'),
    shouldHaveField('startTime', 'string'),
    shouldHaveField('duration', 'number'),
    minLengthShouldBe('name', 2),
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

  const lessonService = new LessonService();
  const lesson = await lessonService.createLesson(validatedData);
  ctx.body = { ...lesson };
  ctx.response.status = httpCodes.CREATED;
  await next();
}
