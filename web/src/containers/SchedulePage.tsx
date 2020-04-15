import * as React from 'react';
import { useEffect, useState } from 'react';
import { GroupService, Lesson } from '../services/groupService';
import { LocalStorageService } from '../services/localStorageService';
import './SchedulePage.less';
import { organizeLessons, getCurrentWeekNumber } from '../utils/lessons';
import { WeekSchedule } from '../components/Schedule/WeekSchedule';
import { PrevWeekButton } from '../components/Buttons/prevWeekButton';
import { NextWeekButton } from '../components/Buttons/nextWeekButton';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const SchedulePage = () => {
  const [schedule, setSchedule] = useState<Lesson[][][]>([]);
  const [weekNumber, setWeekNumber] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async function() {
      /**
       * @name lessons - Array of lessons sorted by date
       * @name organizedLessons - Array, that contains array of lessons formed by weeks
       */
      setLoading(true);
      const token = new LocalStorageService().getToken();
      const groupService = new GroupService(token);
      const groupLessons = await groupService.getLessons();
      const lessons = groupLessons.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

      const organizedLessons = organizeLessons(lessons);
      setSchedule(organizedLessons);

      const currentWeek = getCurrentWeekNumber(organizedLessons);
      setWeekNumber(currentWeek);
      setLoading(false);
    })();
  }, []);

  const nextWeekSwitch = (): void => {
    if (weekNumber < schedule.length - 1) {
      setWeekNumber(weekNumber + 1);
    }
  };

  const prevWeekSwitch = (): void => {
    if (weekNumber > 0) {
      setWeekNumber(weekNumber - 1);
    }
  };

  const content =
    !loading && schedule.length > 0 ? (
      <React.Fragment>
        <PrevWeekButton prevWeekSwitch={prevWeekSwitch} />
        <WeekSchedule schedule={schedule[weekNumber]} />
        <NextWeekButton nextWeekSwitch={nextWeekSwitch} />
      </React.Fragment>
    ) : null;
  return (
    <div className='schedule-page-container'>
      <Spin size='large' indicator={<LoadingOutlined />} spinning={loading} />
      <div className='schedule-page-content-container'>{content}</div>
    </div>
  );
};
