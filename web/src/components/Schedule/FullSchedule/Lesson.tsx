import * as React from 'react';
import { Card } from 'antd';
import { Lesson as LessonModel } from '../../../services/groupService';
import './Lesson.less';

interface LessonProps {
  lesson: LessonModel;
}

export const Lesson: React.FC<LessonProps> = ({ lesson }) => {
  return (
    <Card>
      <div className='lesson-card'>
        <span>
          {lesson.name} {lesson.location}
        </span>
      </div>
    </Card>
  );
};
