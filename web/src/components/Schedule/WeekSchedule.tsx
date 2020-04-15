import * as React from 'react';
import { Row } from 'antd';
import { Lesson } from '../../services/groupService';
import { DaySchedule } from './DaySchedule';

interface WeekScheduleProps {
  schedule: Lesson[][];
}

export const WeekSchedule: React.FC<WeekScheduleProps> = ({ schedule }) => {
  const weekSchedule = schedule.map((daySchedule, index) => {
    return <DaySchedule dailyLessons={daySchedule} key={index} index={index} />;
  });

  return <Row className='row-container'>{weekSchedule}</Row>;
};
