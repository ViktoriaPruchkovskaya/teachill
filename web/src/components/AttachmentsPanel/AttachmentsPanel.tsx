import * as React from 'react';
import { useState } from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import { Button, Upload } from 'antd';
import { AttachmentService } from '../../services/attachmentService';
import { Lesson } from '../../services/groupService';
import { AttachDrawer } from './AttachDrawer';
import { useTranslation } from 'react-i18next';

interface AttachmentsPanelProps {
  files: UploadFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  lesson: Lesson;
}

export const AttachmentsPanel: React.FC<AttachmentsPanelProps> = ({ files, setFiles, lesson }) => {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState<boolean>(false);

  const toggleDrawer = (): void => {
    setVisibility(!visibility);
  };

  return (
    <>
      <div className='lesson-attachments'>
        <Button onClick={toggleDrawer}>{t('attachments.attachment')}</Button>
      </div>
      <Upload
        listType='picture'
        onChange={param => {
          setFiles(param.fileList);
        }}
        onRemove={file => {
          const attachmentService = new AttachmentService();
          return attachmentService.deleteAttachment(Number(file.uid));
        }}
        fileList={files}
      />
      <AttachDrawer
        visibility={visibility}
        onClick={toggleDrawer}
        files={files}
        setFiles={setFiles}
        lesson={lesson}
      />
    </>
  );
};
