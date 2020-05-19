import { useEffect, useState } from 'react';
import { LessonService, Lesson } from '../services/lessonService';
import { filterScheduleBySubgroup } from '../utils/lessons';

export function useScheduleData(): [Lesson[][][], (filter?: number) => Promise<Lesson[][][]>] {
  const [schedule, setSchedule] = useState<Lesson[][][]>([]);

  async function refreshSchedule(filter?: number): Promise<Lesson[][][]> {
    const lessonService = new LessonService();
    let schedule = await lessonService.getSchedule();
    if (filter) {
      schedule = filterScheduleBySubgroup(filter, schedule);
    }
    setSchedule(schedule);
    return schedule;
  }

  useEffect(() => {
    (async function() {
      await refreshSchedule();
    })();
  }, []);

  return [schedule, refreshSchedule];
}
