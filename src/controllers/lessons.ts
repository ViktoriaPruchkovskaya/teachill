import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { LessonService } from '../services/lessons';
import { Validator, shouldHaveField, ValidationFailed, minLengthShouldBe } from '../validations';
import { NotFoundError } from '../errors';
import { State } from '../state';

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

export async function createLesson(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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
      return next();
    }
  }

  const lessonService = new LessonService();
  const lesson = await lessonService.createLesson(validatedData);
  ctx.body = { ...lesson };
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function getLessonTypes(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const lessonService = new LessonService();
  const lessonTypes = await lessonService.getLessonTypes();
  ctx.body = [...lessonTypes];
  ctx.response.status = httpCodes.OK;
  await next();
}

export async function createGroupLesson(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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
      return next();
    }
  }

  const lessonService = new LessonService();
  try {
    await lessonService.createGroupLesson(validatedData.lessonId, ctx.params.group_id);
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

export async function getGroupLessons(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const lessonService = new LessonService();
  try {
    const groupLessons = await lessonService.getGroupLessons(ctx.state.user);
    ctx.body = [...groupLessons];
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

export async function assignTeacherToLesson(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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
      return next();
    }
  }

  const lessonService = new LessonService();
  try {
    await lessonService.assignTeacherToLesson(ctx.params.id, validatedData.teacherId);
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
