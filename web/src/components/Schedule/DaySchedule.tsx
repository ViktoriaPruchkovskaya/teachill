import * as React from 'react';
import { Lesson as LessonModel } from '../../services/groupService';
import { Col, Card } from 'antd';
import { defineWeekday } from '../../utils/lessons';
import { Lesson } from './Lesson';

interface DayScheduleProps {
  dailyLessons: LessonModel[];
  serialNumber: number;
}

export const DaySchedule: React.FC<DayScheduleProps> = ({ dailyLessons, serialNumber }) => {
  const educationDay = dailyLessons.map(lesson => <Lesson lesson={lesson} key={lesson.id} />);
  return (
    <Col span={7} className='schedule-page-daily-card-container'>
      <Card title={defineWeekday(serialNumber)}>{educationDay}</Card>
    </Col>
  );
};
