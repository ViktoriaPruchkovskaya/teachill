import { Button, Upload } from 'antd';
import { AttachmentService } from '../../services/attachmentService';
import * as React from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import { Lesson } from '../../services/groupService';
import { useTranslation } from 'react-i18next';
import { UploadOutlined } from '@ant-design/icons';

interface FileUploadProps {
  files: UploadFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  lesson: Lesson;
}

export const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles, lesson }) => {
  const { t } = useTranslation();

  return (
    <Upload
      showUploadList={false}
      action='/api/upload'
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
      fileList={files}
    >
      <Button>
        <UploadOutlined /> {t('attachments.computer')}
      </Button>
    </Upload>
  );
};
