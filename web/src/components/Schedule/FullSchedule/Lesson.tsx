import * as React from 'react';
import { useContext, useState } from 'react';
import { Card, Form } from 'antd';
import { Lesson as LessonModel } from '../../../services/groupService';
import { LessonModal } from '../../LessonModal/LessonModal';
import { getTime, addDuration } from '../../../utils/date';
import { LessonService } from '../../../services/lessonService';
import { ScheduleContext } from '../../../contexts/scheduleContext';
import './Lesson.less';

interface LessonProps {
  lesson: LessonModel;
}

export interface UpdateLessonData {
  id: number;
  description: string;
}

export const Lesson: React.FC<LessonProps> = ({ lesson }) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const scheduleContext = useContext(ScheduleContext);
  const [form] = Form.useForm();

  const toggleModal = (): void => {
    setVisibility(!visibility);

    if (visibility) {
      form.resetFields();
    }
  };

  const handleSubmit = (values: UpdateLessonData): void => {
    (async function() {
      values.id = lesson.id;
      const lessonService = new LessonService();
      await lessonService.updateLesson(values);
      await scheduleContext.refreshSchedule();
      toggleModal();
    })();
  };

  return (
    <div>
      <Card hoverable={true} onClick={toggleModal}>
        <div className={`lesson-card lesson-type-${lesson.typeId}`}>
          <h4 className='lesson-name'>
            {lesson.name} {lesson.subgroup ? '📚 ' : null}
          </h4>
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
      {!visibility ? (
        ''
      ) : (
        <LessonModal
          form={form}
          visible={visibility}
          lesson={lesson}
          onCancel={toggleModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
