import * as React from 'react';
import { useState } from 'react';
import { Card } from 'antd';
import { Lesson as LessonModel } from '../../../services/groupService';
import { LessonModal } from '../../LessonModal/LessonModal';
import { getTime, addDuration } from '../../../utils/date';
import './Lesson.less';
import { getGroupIfLessonExist } from '../../../../../src/tests/mocks/attachments';

interface LessonProps {
  lesson: LessonModel;
}

export const Lesson: React.FC<LessonProps> = ({ lesson }) => {
  const [visibility, setVisibility] = useState<boolean>(false);

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  return (
    <div>
      <Card hoverable={true} onClick={toggleModal}>
        <div className={`lesson-card lesson-type-${lesson.typeId}`}>
          <h4 className='lesson-name'>{lesson.name}</h4>
          <div className='lesson-info-side'>
            <span className='lesson-time'>
              {getTime(lesson.startTime)}-{addDuration(lesson.startTime, lesson.duration)}
            </span>
            <span>
              <i>{lesson.location || 'N/A'}</i>
            </span>
          </div>
        </div>
      </Card>
      <LessonModal visible={visibility} lesson={lesson} onCancel={toggleModal} />
    </div>
  );
};
