import { BSUIRClient } from './client';
import { BSUIRResponseMapper } from './mapper';
import { GroupService } from '../../services/groups';
import { LessonService } from '../../services/lessons';
import { TeacherService } from '../../services/teachers';
import { NotFoundError } from '../../errors';

export function syncGroup(groupNumber: number) {
  const client = new BSUIRClient();
  const mapper = new BSUIRResponseMapper();
  client
    .getGroupSchedule(groupNumber)
    .then(groupSchedule => mapper.getSchedule(groupSchedule))
    .then(async groupSchedule => {
      const groupService = new GroupService();
      const lessonService = new LessonService();
      const teacherService = new TeacherService();

      const { id } = await groupService.getGroupByName(groupSchedule.name);

      const teachers = new Set();
      groupSchedule.lessons.map(lesson => lesson.teacher.map(teacher => teachers.add(teacher.fio)));
      const teachersArray = Array.from(teachers);

      await Promise.all(
        teachersArray.map(async teacher => {
          try {
            await teacherService.getTeacherByFullName(teacher as string);
          } catch (err) {
            if (err instanceof NotFoundError) {
              await teacherService.createTeacher(teacher as string);
            }
          }
        })
      );

      await Promise.all(
        groupSchedule.lessons.map(async lesson => {
          const createdLesson = await lessonService.createLesson(lesson);
          await lessonService.createGroupLesson(createdLesson.id, id, lesson.subgroup);
          await Promise.all(
            lesson.teacher.map(async t => {
              const teacher = await teacherService.getTeacherByFullName(t.fio);
              await lessonService.assignTeacherToLesson(createdLesson.id, teacher.id);
            })
          );
        })
      );
    })
    .catch(err => console.error(err));
}
