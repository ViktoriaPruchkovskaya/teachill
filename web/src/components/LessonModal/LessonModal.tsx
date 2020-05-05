import * as React from 'react';
import { Modal, Form, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import { Lesson as LessonModel } from '../../services/groupService';
import { addDuration, getTime } from '../../utils/date';
import { UpdateLessonData } from '../Schedule/FullSchedule/Lesson';
import './LessonModal.less';
import { useTranslation } from 'react-i18next';

interface LessonDescriptionProps {
  form: FormInstance;
  visible: boolean;
  lesson: LessonModel;
  onCancel(): void;
  onSubmit(value: UpdateLessonData): void;
}

export const LessonModal: React.FC<LessonDescriptionProps> = ({
  form,
  visible,
  lesson,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      title={`${lesson.name} ${lesson.location}`}
      footer={
        <Button type='primary' onClick={() => onSubmit(form.getFieldsValue() as UpdateLessonData)}>
          {t('forms.confirm')}
        </Button>
      }
      onCancel={onCancel}
      className={`lesson-type-id-${lesson.typeId}`}
    >
      <div className='lesson-description-main-info'>
        <h4 className='lesson-teachers'>
          {lesson.teacher.map(teacher => teacher.fullName).join(', ') || 'N/A'}
        </h4>
        <h4 className='lesson-time'>
          {getTime(lesson.startTime)}-{addDuration(lesson.startTime, lesson.duration)}
        </h4>
      </div>
      <Form form={form} initialValues={{ description: lesson.description }}>
        <Form.Item name='description'>
          <TextArea autoSize allowClear placeholder={t('forms.lesson')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
