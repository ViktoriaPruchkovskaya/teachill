import * as React from 'react';
import { Lesson } from '../services/lessonService';

export interface ScheduleContextProps {
  schedule: Lesson[][][];
  refreshSchedule(filter?: number): Promise<Lesson[][][]>;
}

export const ScheduleContext = React.createContext<ScheduleContextProps>(null);
