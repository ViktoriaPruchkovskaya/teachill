import * as React from 'react';
import { Lesson } from '../services/groupService';

export interface ScheduleContextProps {
  schedule: Lesson[][][];
  refreshSchedule(): Promise<Lesson[][][]>;
}

export const ScheduleContext = React.createContext<ScheduleContextProps>(null);
