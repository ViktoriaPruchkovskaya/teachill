import * as React from 'react';
import { Row } from 'antd';
import { Lesson } from '../../../services/lessonService';
import { DaySchedule } from './DaySchedule';
import { setDate } from '../../../utils/lessons';

interface WeekScheduleProps {
  schedule: Lesson[][];
}

export const WeekSchedule: React.FC<WeekScheduleProps> = ({ schedule }) => {
  const weekdaysDates = setDate(schedule);

  const weekSchedule = schedule.map((daySchedule, index) => {
    return (
      <DaySchedule
        dailyLessons={daySchedule}
        key={index}
        index={index}
        date={weekdaysDates[index]}
      />
    );
  });

  return <Row className='row-container'>{weekSchedule}</Row>;
};
