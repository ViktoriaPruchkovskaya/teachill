import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { UploadFile } from 'antd/es/upload/interface';
import TextArea from 'antd/lib/input/TextArea';
import { Lesson as LessonModel } from '../../services/groupService';
import { addDuration, getTime } from '../../utils/date';
import { AttachmentService } from '../../services/attachmentService';
import { UpdateLessonData } from '../Schedule/FullSchedule/Lesson';
import { AttachmentsPanel } from '../AttachmentsPanel/AttachmentsPanel';
import { useTranslation } from 'react-i18next';
import './LessonModal.less';

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
  const [files, setFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    (async function() {
      const attachmentService = new AttachmentService();
      const attachments = await attachmentService.getLessonAttachments(lesson.id);
      setFiles(
        attachments.map(attachments => {
          return {
            uid: attachments.id.toString(),
            size: 50,
            name: attachments.name,
            url: attachments.url,
            type: 'document',
          };
        })
      );
    })();
  }, []);
  return (
    <Modal
      visible={visible}
      title={`${lesson.name} ${lesson.location} ${lesson.subgroup ? `(${lesson.subgroup})` : ''}`}
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
      <AttachmentsPanel files={files} setFiles={setFiles} lesson={lesson} />
    </Modal>
  );
};
