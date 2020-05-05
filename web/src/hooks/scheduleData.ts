import { GroupService, Lesson } from '../services/groupService';
import { useEffect, useState } from 'react';

export function useScheduleData(): [Lesson[][][], () => Promise<Lesson[][][]>] {
  const [schedule, setSchedule] = useState<Lesson[][][]>([]);

  async function refreshSchedule(): Promise<Lesson[][][]> {
    const groupService = new GroupService();
    const schedule = await groupService.getSchedule();
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
