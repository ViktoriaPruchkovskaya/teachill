import * as React from 'react';
import { Lesson } from '../../services/groupService';
import { Col, Card } from 'antd';

interface DayScheduleProps {
  dailyLessons: Lesson[];
}

export const DaySchedule: React.FC<DayScheduleProps> = ({ dailyLessons }) => {
  const educationDay = dailyLessons.map((lesson, index) => <p key={index}>{lesson.name}</p>);
  return (
    <Col span={7} className='schedule-page-daily-card-container'>
      <Card>{educationDay}</Card>
    </Col>
  );
};
