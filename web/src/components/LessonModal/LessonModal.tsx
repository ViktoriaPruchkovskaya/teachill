import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Lesson as LessonModel } from '../../services/groupService';
import { addDuration, getTime } from '../../utils/date';
import { AttachmentService } from '../../services/attachmentService';
import { UploadFile } from 'antd/es/upload/interface';
import './LessonModal.less';

interface LessonDescriptionProps {
  visible: boolean;
  onCancel(): void;
  lesson: LessonModel;
}

export const LessonModal: React.FC<LessonDescriptionProps> = ({ visible, onCancel, lesson }) => {
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
      <Upload
        action='/api/upload'
        listType='picture'
        onChange={param => {
          setFiles(param.fileList);
          if (param.file.status === 'done') {
            (async function() {
              const attachmentService = new AttachmentService();
              const attachmentId = await attachmentService.createAttachment({
                lessonId: lesson.id,
                name: param.file.name,
                url: param.file.response.filePath,
              });
              const fileList = param.fileList.map(file => {
                if (file.uid == param.file.uid) {
                  file.uid = attachmentId.toString();
                  file.url = file.response.filePath;
                }
                return file;
              });
              setFiles(fileList);
            })();
          }
        }}
        onRemove={file => {
          const attachmentService = new AttachmentService();
          return attachmentService.deleteAttachment(Number(file.uid));
        }}
        fileList={files}
      >
        <Button>
          <UploadOutlined /> Upload
        </Button>
      </Upload>
    </Modal>
  );
};
