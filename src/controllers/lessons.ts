import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { LessonService } from '../services/lessons';
import { Validator, shouldHaveField, ValidationFailed, minLengthShouldBe } from '../validations';
import { NotFoundError } from '../errors';

interface LessonData {
  name: string;
  typeId: number;
  location: string;
  startTime: string;
  duration: number;
  description?: string;
}

interface GroupLessonData {
  lessonId: number;
}

interface TeacherData {
  teacherId: number;
}

export async function createLessonController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: LessonData;
  const validator = new Validator<LessonData>([
    shouldHaveField('name', 'string'),
    shouldHaveField('typeId', 'number'),
    shouldHaveField('location', 'string'),
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

export async function getLessonTypesController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const lessonService = new LessonService();
  const lessonTypes = await lessonService.getLessonTypes();
  ctx.body = [...lessonTypes];
  ctx.response.status = httpCodes.OK;
  await next();
}

export async function createGroupLessonController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: GroupLessonData;
  const validator = new Validator<GroupLessonData>([shouldHaveField('lessonId', 'number')]);
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
  try {
    await lessonService.createGroupLesson(validatedData.lessonId, ctx.params.group_id);
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return await next();
    }
  }

  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function getGroupLessonsController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const lessonService = new LessonService();
  let groupLessons;
  try {
    groupLessons = await lessonService.getGroupLessons(ctx.params.group_id);
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return await next();
    }
  }

  ctx.body = [...groupLessons];
  ctx.response.status = httpCodes.OK;
  await next();
}

export async function assignTeacherToLessonController(
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) {
  let validatedData: TeacherData;
  const validator = new Validator<TeacherData>([shouldHaveField('teacherId', 'number')]);
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
  try {
    await lessonService.assignTeacherToLesson(ctx.params.id, validatedData.teacherId);
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return await next();
    }
  }

  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}
