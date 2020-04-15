import * as React from 'react';
import { useEffect, useState } from 'react';
import { GroupService, Lesson } from '../services/groupService';
import './SchedulePage.less';
import { organizeLessons } from '../utils/lessons';
import { WeekSchedule } from '../components/Schedule/WeekSchedule';
import { LocalStorageService } from '../services/localStorageService';

export const SchedulePage = () => {
  const [schedule, setSchedule] = useState<Lesson[][][]>([]);
  useEffect(() => {
    (async function() {
      /**
       * @name lessons - Array of lessons sorted by date
       * @name organizedLessons - Array, that contains array of lessons formed by weeks
       */

      const token = new LocalStorageService().getToken();
      const groupService = new GroupService(token);
      const groupLessons = await groupService.getLessons();
      const lessons = groupLessons.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

      const organizedLessons = organizeLessons(lessons);
      setSchedule(organizedLessons);
    })();
  }, []);

  const content = schedule.length > 0 ? <WeekSchedule schedule={schedule[0]} /> : null;

  return (
    <div className='schedule-page-container'>
      <div className='schedule-page-content-container'>{content}</div>
    </div>
  );
};
