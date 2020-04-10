import * as React from 'react';
import { Card } from 'antd';
import { Lesson as LessonProp } from '../../services/groupService';

interface LessonProps {
  lesson: LessonProp;
}

export const Lesson: React.FC<LessonProps> = ({ lesson }) => {
  return (
    <Card className='schedule-page-daily-lesson-card-container'>
      <p>
        {lesson.name} {lesson.location}
      </p>
    </Card>
  );
};
