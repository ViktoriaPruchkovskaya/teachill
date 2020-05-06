import { Lesson } from '../services/groupService';
import { getWeek, getDay, addDays } from 'date-fns';
import { getDate } from './date';

const STUDY_WEEK_LENGTH = 6;

function splitLessonsByFuncDiffResult(
  lessons: Lesson[],
  diffFunc: (arg: Date) => number
): Lesson[][] {
  const lessonsSplit = [];
  let previousSplit = 0;
  if (diffFunc.name === 'getDay' && diffFunc(lessons[0].startTime) - 1 > 0) {
    lessonsSplit.push(...new Array(diffFunc(lessons[0].startTime) - 1).fill([]));
  }

  for (let i = 1; i < lessons.length - 1; i++) {
    if (diffFunc(lessons[i].startTime) !== diffFunc(lessons[i - 1].startTime)) {
      lessonsSplit.push(lessons.slice(previousSplit, i));
      previousSplit = i;
    }

    if (diffFunc(lessons[i].startTime) - diffFunc(lessons[i - 1].startTime) > 1) {
      lessonsSplit.push([]);
      previousSplit = i;
    }
  }

  lessonsSplit.push(lessons.slice(previousSplit, lessons.length));
  return lessonsSplit;
}

function completeScheduleWeek(week: Lesson[][]): Lesson[][] {
  if (week.length < STUDY_WEEK_LENGTH) {
    week.push(...new Array(STUDY_WEEK_LENGTH - week.length).fill([]));
  }
  return week;
}

/**
 * Restructure lessons array into array of array of array split by weeks and study days.
 * @param lessons - array of lessons.
 * @return array of array of array split by weeks and study days.
 */
export function organizeLessons(lessons: Lesson[]): Lesson[][][] {
  const weekSplits = splitLessonsByFuncDiffResult(lessons, getWeek);
  const formedSchedule = [];
  for (const week of weekSplits) {
    const daySplits = completeScheduleWeek(splitLessonsByFuncDiffResult(week, getDay));
    formedSchedule.push(daySplits);
  }

  return formedSchedule;
}

export function getWeekday(order: number): string {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return weekdays[order];
}

export function getCurrentWeekNumber(lessons: Lesson[][][]): number {
  const currentWeek = lessons.find(week =>
    week.find(lessons => lessons.find(lesson => getWeek(lesson.startTime) === getWeek(new Date())))
  );

  return lessons.indexOf(currentWeek);
}

/**
 * Set date for each day of schedule
 * @param lessons - array of week, containing array of lesson for each day
 * @return array of dates
 */
export function setDate(lessons: Lesson[][]): Array<string> {
  const baseDay = lessons.find(day => day.find(lesson => Object.keys(lesson).length > 0));
  const indexOfBaseDay = lessons.indexOf(baseDay);

  const daysDate = [];
  if (indexOfBaseDay > 0) {
    for (let i = indexOfBaseDay; i > 0; i--) {
      const date = getDate(addDays(baseDay[0].startTime, -i));
      daysDate.push(date);
    }
  }

  for (let i = 0; i < lessons.length - indexOfBaseDay; i++) {
    const date = getDate(addDays(baseDay[0].startTime, i));
    daysDate.push(date);
  }

  return daysDate;
}

export function filterSchedule(filter: number, schedule: Lesson[][][]): Lesson[][][] {
  return schedule.map(week =>
    week.map(day => day.filter(lesson => lesson.subgroup === filter || lesson.subgroup === null))
  );
}
