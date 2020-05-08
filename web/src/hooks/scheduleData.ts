import { useEffect, useState } from 'react';
import { GroupService, Lesson } from '../services/groupService';
import { filterScheduleBySubgroup } from '../utils/lessons';

export function useScheduleData(): [Lesson[][][], (filter?: number) => Promise<Lesson[][][]>] {
  const [schedule, setSchedule] = useState<Lesson[][][]>([]);

  async function refreshSchedule(filter?: number): Promise<Lesson[][][]> {
    const groupService = new GroupService();
    let schedule = await groupService.getSchedule();
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
