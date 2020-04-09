import { Lesson } from '../services/groupService';
import { getWeek, getDay } from 'date-fns';

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

export function organizeLessons(lessons: Lesson[]): Lesson[][][] {
  /**
   *@name weekSplits - Array of lessons, sorted by weeks
   *@name formedSchedule - Array, that contains array of lessons formed by weeks
   *@name daySplits - Weekly array of lessons for every day
   */
  const weekSplits = splitLessonsByFuncDiffResult(lessons, getWeek);
  const formedSchedule = [];
  for (const week of weekSplits) {
    const daySplits = splitLessonsByFuncDiffResult(week, getDay);
    formedSchedule.push(daySplits);
  }

  return formedSchedule;
}
