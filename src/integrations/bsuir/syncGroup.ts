import { BSUIRClient } from './client';
import { BSUIRResponseMapper } from './mapper';
import { LessonService } from '../../services/lessons';
import { TeacherService } from '../../services/teachers';
import { Lesson, Teacher } from '../models';
import { Lesson as AppLesson } from '../../services/lessons';
import { Teacher as AppTeacher } from '../../services/teachers';

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
    groupSchedule.lessons.map(lesson =>
      lesson.teacher.map(teacher => teachers.add(teacher.fullName))
    );
    const teachersArray = Array.from(teachers);

    const dbTeachers = await this.createNonExistingTeachers(teachersArray);

    await Promise.all(
      groupSchedule.lessons.map(lesson => this.createLesson(lesson, groupId, dbTeachers))
    );
  }

  private async createNonExistingTeachers(teachers: string[]): Promise<AppTeacher[]> {
    return Promise.all(teachers.map(teacher => this.teacherService.getOrCreateTeacher(teacher)));
  }

  private async assignTeacher(
    createdLesson: AppLesson,
    dbTeachers: AppTeacher[],
    teacher: Teacher
  ): Promise<void> {
    const lessonTeacher = dbTeachers.find(dbTeacher => dbTeacher.fullName === teacher.fullName);
    await this.lessonService.assignTeacherToLesson(createdLesson.id, lessonTeacher.id);
  }

  private async createLesson(
    lesson: Lesson,
    groupId: number,
    dbTeachers: AppTeacher[]
  ): Promise<void> {
    const createdLesson = await this.lessonService.createLesson(lesson);
    await this.lessonService.assignLessonToGroup(createdLesson.id, groupId, lesson.subgroup);
    await Promise.all(
      lesson.teacher.map(teacher => this.assignTeacher(createdLesson, dbTeachers, teacher))
    );
  }
}
