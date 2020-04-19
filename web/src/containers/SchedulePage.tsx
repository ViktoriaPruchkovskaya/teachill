import * as React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { GroupService, Lesson } from '../services/groupService';
import { EmptySchedule } from '../components/Schedule/EmptySchedule/EmptySchedule';
import { FullSchedule } from '../components/Schedule/FullSchedule/FullSchedule';
import { getCurrentWeekNumber } from '../utils/lessons';
import './SchedulePage.less';

export const SchedulePage = () => {
  const [schedule, setSchedule] = useState<Lesson[][][]>([]);
  const [weekNumber, setWeekNumber] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async function() {
      try {
        setLoading(true);

        const groupService = new GroupService();

        const organizedLessons = await groupService.getSchedule();
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
