import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { LessonService } from '../services/lessons';
import {
  Validator,
  shouldHaveField,
  minLengthShouldBe,
  mayHaveFields,
  optionalFieldShouldHaveType,
} from '../validations';
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

interface UpdateLessonData {
  description?: string;
}

export async function createLesson(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<LessonData>([
    shouldHaveField('name', 'string'),
    shouldHaveField('typeId', 'number'),
    shouldHaveField('location', 'string'),
    shouldHaveField('startTime', 'string'),
    shouldHaveField('duration', 'number'),
    minLengthShouldBe('name', 2),
  ]);
  const validatedData = validator.validate(ctx.request.body);

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

export async function assignLessonToGroup(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<GroupLessonData>([shouldHaveField('lessonId', 'number')]);
  const validatedData = validator.validate(ctx.request.body);

  const lessonService = new LessonService();
  await lessonService.assignLessonToGroup(validatedData.lessonId, ctx.params.group_id);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;

  await next();
}

export async function getGroupLessons(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const lessonService = new LessonService();
  const groupLessons = await lessonService.getGroupLessons(ctx.state.user);
  ctx.body = [...groupLessons];
  ctx.response.status = httpCodes.OK;

  await next();
}

export async function assignTeacherToLesson(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<TeacherData>([shouldHaveField('teacherId', 'number')]);
  const validatedData = validator.validate(ctx.request.body);

  const lessonService = new LessonService();
  await lessonService.assignTeacherToLesson(ctx.params.id, validatedData.teacherId);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;

  await next();
}

export async function updateLesson(
  ctx: Koa.ParameterizedContext<State, Koa.DefaultContext>,
  next: Koa.Next
) {
  const validator = new Validator<UpdateLessonData>([
    mayHaveFields(['description']),
    optionalFieldShouldHaveType('description', 'string'),
  ]);
  const validatedData = validator.validate(ctx.request.body);

  const lessonService = new LessonService();
  await lessonService.updateLesson(ctx.state.user, ctx.params.lesson_id, validatedData);
  ctx.body = {};
  ctx.response.status = httpCodes.OK;

  await next();
}
