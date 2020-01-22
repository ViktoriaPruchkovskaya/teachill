import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { Validator, shouldHaveField, ValidationFailed, minLengthShouldBe } from '../validations';
import { TeacherService } from '../services/education';

export async function createTeacherController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator([
    shouldHaveField('fullName', 'string'),
    minLengthShouldBe('fullName', 6),
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

  const teacherService = new TeacherService();
  await teacherService.createTeacher(ctx.request.body.fullName);
  ctx.body = {};
  ctx.response.status = httpCodes.CREATED;
  await next();
}

export async function getTeachersController(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const teacherService = new TeacherService();
  const teachers = await teacherService.getTeachers();
  ctx.body = { teachers };
  ctx.response.status = httpCodes.OK;
  await next();
}
