import * as React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { GroupService, Lesson } from '../services/groupService';
import { StorageService } from '../services/storageService';
import { EmptySchedule } from '../components/Schedule/EmptySchedule/EmptySchedule';
import { FullSchedule } from '../components/Schedule/FullSchedule/FullSchedule';
import { getCurrentWeekNumber, organizeLessons } from '../utils/lessons';
import './SchedulePage.less';

export const SchedulePage = () => {
  const [schedule, setSchedule] = useState<Lesson[][][]>([]);
  const [weekNumber, setWeekNumber] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    const localStorageService = new StorageService();
    const currentGroup = localStorageService.getUserGroup();
    setGroupName(currentGroup.name);

    (async function() {
      try {
        /**
         * @name lessons - Array of lessons sorted by date
         * @name organizedLessons - Array, that contains array of lessons formed by weeks
         */
        setLoading(true);
        const token = localStorageService.getToken();
        const groupService = new GroupService(token);
        const groupLessons = await groupService.getLessons();
        const lessons = groupLessons.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

        const organizedLessons = organizeLessons(lessons);
        setSchedule(organizedLessons);

        const currentWeek = getCurrentWeekNumber(organizedLessons);
        setWeekNumber(currentWeek);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
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

  const displaySchedule = () => {
    if (loading) {
      return null;
    }

    if (!loading && schedule.length === 0) {
      return <EmptySchedule />;
    }

    if (schedule.length > 0) {
      return (
        <FullSchedule
          prevWeekSwitch={prevWeekSwitch}
          nextWeekSwitch={nextWeekSwitch}
          schedule={schedule}
          weekNumber={weekNumber}
        />
      );
    }
  };

  const content = displaySchedule();

  return (
    <div className='schedule-page-container'>
      <Spin size='large' indicator={<LoadingOutlined />} spinning={loading} />
      <div className='schedule-page-content-container'>{content}</div>
    </div>
  );
};
