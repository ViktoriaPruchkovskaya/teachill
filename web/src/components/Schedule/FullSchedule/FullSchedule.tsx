import * as React from 'react';
import { PrevWeekButton } from '../../Buttons/prevWeekButton';
import { WeekSchedule } from './WeekSchedule';
import { NextWeekButton } from '../../Buttons/nextWeekButton';
import { Lesson } from '../../../services/groupService';

interface FullScheduleProps {
  prevWeekSwitch(): void;
  nextWeekSwitch(): void;
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
    <React.Fragment>
      <PrevWeekButton prevWeekSwitch={prevWeekSwitch} />
      <WeekSchedule schedule={schedule[weekNumber]} />
      <NextWeekButton nextWeekSwitch={nextWeekSwitch} />
    </React.Fragment>
  );
};
