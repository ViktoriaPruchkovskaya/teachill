import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { Validator, shouldHaveField, ValidationFailed, minLengthShouldBe } from '../validations';
import { TeacherService } from '../services/teachers';

interface TeacherData {
  fullName: string;
}

export async function createTeacher(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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
      return next();
    }
  }

  const teacherService = new TeacherService();
  const teacher = await teacherService.createTeacher(validatedData.fullName);
  ctx.body = { ...teacher };
  ctx.response.status = httpCodes.CREATED;

  await next();
}

export async function getTeachers(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const teacherService = new TeacherService();
  const teachers = await teacherService.getTeachers();
  ctx.body = [...teachers];
  ctx.response.status = httpCodes.OK;
  await next();
}
