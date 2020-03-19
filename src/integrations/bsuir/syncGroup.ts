import { BSUIRClient } from './client';
import { BSUIRResponseMapper } from './mapper';
import { LessonService } from '../../services/lessons';
import { TeacherService } from '../../services/teachers';
import { Lesson } from '../models';
import { Teacher } from '../../repositories/teachers';

export class GroupSyncService {
  private lessonService: LessonService;
  private teacherService: TeacherService;

  constructor() {
    this.lessonService = new LessonService();
    this.teacherService = new TeacherService();
  }

  public async syncGroup(groupId: number, groupNumber: number): Promise<void> {
    const client = new BSUIRClient();
    const mapper = new BSUIRResponseMapper();

    const groupSchedule = mapper.getSchedule(await client.getGroupSchedule(groupNumber));

    const teachers = new Set<string>();
    groupSchedule.lessons.map(lesson => lesson.teacher.map(teacher => teachers.add(teacher.fio)));
    const teachersArray = Array.from(teachers);

    const dbTeachers = await this.createNonExistingTeachers(teachersArray);

    await Promise.all(
      groupSchedule.lessons.map(lesson => this.createLesson(lesson, groupId, dbTeachers))
    );
  }

  private async createNonExistingTeachers(teachers: string[]): Promise<Teacher[]> {
    return Promise.all(
      teachers.map(async teacher => this.teacherService.getOrCreateTeacher(teacher))
    );
  }

  private async createLesson(
    lesson: Lesson,
    groupId: number,
    dbTeachers: Teacher[]
  ): Promise<void> {
    const createdLesson = await this.lessonService.createLesson(lesson);
    await this.lessonService.createGroupLesson(createdLesson.id, groupId, lesson.subgroup);
    await Promise.all(
      lesson.teacher.map(async t => {
        const teacher = dbTeachers.find(dbTeacher => dbTeacher.fullName === t.fio);
        await this.lessonService.assignTeacherToLesson(createdLesson.id, teacher.id);
      })
    );
  }
}
