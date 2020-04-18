import * as React from 'react';
import { Modal } from 'antd';
import { Lesson as LessonModel } from '../../services/groupService';
import { addDuration, getTime } from '../../utils/date';
import './LessonModal.less';

interface LessonDescriptionProps {
  visible: boolean;
  onCancel(): void;
  lesson: LessonModel;
}

export const LessonModal: React.FC<LessonDescriptionProps> = ({ visible, onCancel, lesson }) => {
  return (
    <div className='ex'>
      <Modal
        visible={visible}
        title={`${lesson.name} ${lesson.location}`}
        footer={null}
        onCancel={onCancel}
        className={`lesson-type-id-${lesson.typeId}`}
      >
        <div className='lesson-description-main-info'>
          <h4 className='lesson-teachers'>
            {lesson.teacher.map(teacher => teacher.fullName).join(', ')}
          </h4>
          <h4 className='lesson-time'>
            {getTime(lesson.startTime)}-{addDuration(lesson.startTime, lesson.duration)}
          </h4>
        </div>
      </Modal>
    </div>
  );
};
