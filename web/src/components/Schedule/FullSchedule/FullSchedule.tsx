import * as React from 'react';
import { WeekPaginationButton } from '../../Buttons/WeekPaginationButton';
import { WeekSchedule } from './WeekSchedule';
import { Lesson } from '../../../services/lessonService';

interface FullScheduleProps {
  prevWeekSwitch(event: React.MouseEvent): void;
  nextWeekSwitch(event: React.MouseEvent): void;
  schedule: Lesson[][][];
  weekNumber: number;
}

export const FullSchedule: React.FC<FullScheduleProps> = ({
  prevWeekSwitch,
  nextWeekSwitch,
  schedule,
  weekNumber,
}) => {
  return (
    <div className='schedule-page-content-container'>
      <WeekPaginationButton onClick={prevWeekSwitch} direction='prev' />
      <WeekSchedule schedule={schedule[weekNumber]} />
      <WeekPaginationButton onClick={nextWeekSwitch} direction='next' />
    </div>
  );
};
