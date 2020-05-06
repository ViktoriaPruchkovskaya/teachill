import { GroupScheduleResponse, WeekDayScheduleResponse } from './client';
import {
  compareDesc,
  addDays,
  getDay,
  getDate,
  getMonth,
  getYear,
  getWeek,
  formatISO,
  differenceInMinutes,
} from 'date-fns';
import { Lesson, GroupSchedule } from '../models';

const WEEK_START_DAY = 1;

export class BSUIRResponseMapper {
  public getSchedule(groupSchedule: GroupScheduleResponse): GroupSchedule {
    const todayDate = this.convertToDate(groupSchedule.todayDate);
    const endDate = this.convertToDate(groupSchedule.dateEnd);

    const lessons: Lesson[] = [];
    let currentDate = todayDate;
    while (compareDesc(currentDate, addDays(endDate, 1)) === 1) {
      if (!this.checkForWeekDayExistence(groupSchedule.schedules, getDay(currentDate))) {
        currentDate = addDays(currentDate, 1);
        continue;
      }
      const studyWeek = this.getStudyWeek(
        getWeek(todayDate, { weekStartsOn: WEEK_START_DAY }),
        getWeek(currentDate, { weekStartsOn: WEEK_START_DAY }),
        groupSchedule.currentWeekNumber
      );
      const currentWeekDay = getDay(currentDate);
      const lessonsDay = groupSchedule.schedules.find(
        day => this.convertWeekNameToNumber(day.weekDay) === currentWeekDay
      );
      const currentStudyWeekLessons = lessonsDay.schedule.filter(lesson =>
        lesson.weekNumber.find(weekNumber => weekNumber === studyWeek)
      );

      const lesson: Lesson[] = currentStudyWeekLessons.map(lesson => {
        const formatedLesson: Lesson = {
          name: lesson.subject,
          typeId: this.convertLessonTypeToNumber(lesson.lessonType),
          subgroup: lesson.numSubgroup > 0 ? lesson.numSubgroup : null,
          location: lesson.auditory.length > 0 ? lesson.auditory[0] : '',
          startTime: this.convertToUnixTime(currentDate, lesson.startLessonTime),
          duration: this.calculateDuration(
            currentDate,
            lesson.startLessonTime,
            lesson.endLessonTime
          ),
          teacher: lesson.employee.map(teacher => ({ fullName: teacher.fio })),
        };
        return formatedLesson;
      });

      lessons.push(...lesson);
      currentDate = addDays(currentDate, 1);
    }

    return { name: groupSchedule.studentGroup.name, lessons: lessons };
  }

  private convertToDate(stringDate: string): Date {
    const [day, month, year] = stringDate.split('.').map(element => Number(element));
    return new Date(year, month - 1, day);
  }

  private getStudyWeek(
    calendarWeek: number,
    nextCalendarWeek: number,
    currentStudyWeek: number
  ): number {
    return ((currentStudyWeek - 1 + (nextCalendarWeek - calendarWeek)) % 4) + 1;
  }

  private convertToUnixTime(date: Date, time: string): string {
    const year = getYear(date);
    const month = getMonth(date);
    const day = getDate(date);
    const [hour, minute] = time.split(':').map(element => Number(element));
    return formatISO(new Date(year, month, day, hour, minute));
  }

  private calculateDuration(date: Date, startTime: string, endTime: string): number {
    const year = getYear(date);
    const month = getMonth(date);
    const day = getDate(date);
    const [startHour, startMinute] = startTime.split(':').map(element => Number(element));
    const [endHour, endMinute] = endTime.split(':').map(element => Number(element));
    return differenceInMinutes(
      new Date(year, month, day, endHour, endMinute),
      new Date(year, month, day, startHour, startMinute)
    );
  }

  private checkForWeekDayExistence(schedule: WeekDayScheduleResponse[], number: number): boolean {
    if (!schedule.find(lesson => lesson.weekDay === this.convertNumberToWeekName(number))) {
      return false;
    } else return true;
  }

  private convertNumberToWeekName(order: number): string {
    const weekdays = [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ];
    return weekdays[order];
  }

  private convertWeekNameToNumber(weekName: string): number {
    switch (weekName) {
      case 'Понедельник': {
        return 1;
      }
      case 'Вторник': {
        return 2;
      }
      case 'Среда': {
        return 3;
      }
      case 'Четверг': {
        return 4;
      }
      case 'Пятница': {
        return 5;
      }
      case 'Суббота': {
        return 6;
      }
      default: {
        throw new Error(`${weekName} is not exist`);
      }
    }
  }

  private convertLessonTypeToNumber(lessonType: string): number {
    switch (lessonType) {
      case 'ЛК': {
        return 1;
      }
      case 'ЛР': {
        return 2;
      }
      case 'ПЗ': {
        return 3;
      }
    }
  }
}
