import * as React from 'react';
import './EmptySchedule.less';

export const EmptySchedule: React.FC = () => {
  return (
    <div className='empty-schedule-container'>
      <span className='empty-schedule-emoji'>🎉</span>
      <h1> Schedule is empty</h1>
      <h2 className='empty-schedule-text'>You have no lessons, relax</h2>
    </div>
  );
};
