import { Lesson } from '../services/groupService';
import { getWeek, getDay } from 'date-fns';

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
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return weekdays[order];
}
