import * as React from 'react';
import { Lesson as LessonModel } from '../../services/groupService';
import { Col, Card } from 'antd';
import { getWeekday } from '../../utils/lessons';
import { Lesson } from './Lesson';
import './DaySchedule.less';

interface DayScheduleProps {
  dailyLessons: LessonModel[];
  index: number;
}

export const DaySchedule: React.FC<DayScheduleProps> = ({ dailyLessons, index }) => {
  const educationDay = dailyLessons.map(lesson => <Lesson lesson={lesson} key={lesson.id} />);
  return (
    <Col span={7} className='schedule-page-daily-card-container'>
      <Card title={getWeekday(index)} className='day-schedule-panel'>
        <div className='card-schedule-body'>{educationDay}</div>
      </Card>
    </Col>
  );
};
