import * as Koa from 'koa';
import * as httpCodes from '../constants/httpCodes';
import { Validator, shouldHaveField, minLengthShouldBe } from '../validations';
import { TeacherService } from '../services/teachers';

interface TeacherData {
  fullName: string;
}

export async function createTeacher(ctx: Koa.ParameterizedContext, next: Koa.Next) {
  const validator = new Validator<TeacherData>([
    shouldHaveField('fullName', 'string'),
    minLengthShouldBe('fullName', 6),
  ]);
  const validatedData = validator.validate(ctx.request.body);

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
