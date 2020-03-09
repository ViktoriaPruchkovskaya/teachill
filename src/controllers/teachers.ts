import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { Validator, shouldHaveField, ValidationFailed, minLengthShouldBe } from '../validations';
import { TeacherService } from '../services/teachers';
import { NotFoundError, ExistError } from '../errors';

interface TeacherData {
  fullName: string;
}

export async function createTeacherController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  let validatedData: TeacherData;
  const validator = new Validator<TeacherData>([
    shouldHaveField('fullName', 'string'),
    minLengthShouldBe('fullName', 6),
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

  const teacherService = new TeacherService();
  let teacher;
  try {
    teacher = await teacherService.createTeacher(validatedData.fullName);
  } catch (err) {
    if (err instanceof ExistError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return await next();
    }
  }

  ctx.body = { ...teacher };
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function getTeachersController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const teacherService = new TeacherService();
  let teachers;
  try {
    teachers = await teacherService.getTeachers();
  } catch (err) {
    if (err instanceof NotFoundError) {
      ctx.body = {
        error: err.message,
      };
      ctx.response.status = httpCodes.NOT_FOUND;
      return await next();
    }
  }

  ctx.body = [...teachers];
  ctx.response.status = httpCodes.OK;
  await next();
}
