import { BSUIRClient } from './client';
import { BSUIRResponseMapper } from './mapper';
import { LessonService } from '../../services/lessons';
import { TeacherService } from '../../services/teachers';
import { NotFoundError } from '../../errors';

async function createNonExistingTeachers(service: TeacherService, teachers: string[]) {
  teachers.map(async teacher => {
    try {
      await service.getTeacherByFullName(teacher);
    } catch (err) {
      if (err instanceof NotFoundError) {
        await service.createTeacher(teacher);
      }
    }
  });
}

export async function syncGroup(groupId: number, groupNumber: number): Promise<void> {
  const client = new BSUIRClient();
  const mapper = new BSUIRResponseMapper();

  const groupSchedule = mapper.getSchedule(await client.getGroupSchedule(groupNumber));

  const lessonService = new LessonService();
  const teacherService = new TeacherService();

  const teachers = new Set<string>();
  groupSchedule.lessons.map(lesson => lesson.teacher.map(teacher => teachers.add(teacher.fio)));
  const teachersArray = Array.from(teachers);

  await createNonExistingTeachers(teacherService, teachersArray);

  await Promise.all(
    groupSchedule.lessons.map(async lesson => {
      const createdLesson = await lessonService.createLesson(lesson);
      await lessonService.createGroupLesson(createdLesson.id, groupId, lesson.subgroup);
      await Promise.all(
        lesson.teacher.map(async t => {
          const teacher = await teacherService.getTeacherByFullName(t.fio);
          await lessonService.assignTeacherToLesson(createdLesson.id, teacher.id);
        })
      );
    })
  );
}
