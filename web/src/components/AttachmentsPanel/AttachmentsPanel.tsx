import * as React from 'react';
import { useState, useContext } from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import { Button, Upload } from 'antd';
import { AttachmentService } from '../../services/attachmentService';
import { Lesson } from '../../services/groupService';
import { AttachDrawer } from './AttachDrawer';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../contexts/userContext';
import { RoleType } from '../../services/authService';

interface AttachmentsPanelProps {
  files: UploadFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  lesson: Lesson;
}

export const AttachmentsPanel: React.FC<AttachmentsPanelProps> = ({ files, setFiles, lesson }) => {
  const { t } = useTranslation();
  const userContext = useContext(UserContext);
  const [visibility, setVisibility] = useState<boolean>(false);

  const toggleDrawer = (): void => {
    setVisibility(!visibility);
  };

  const attachmentButton =
    userContext.role === RoleType.Administrator ? (
      <Button onClick={toggleDrawer}>{t('attachments.attachment')}</Button>
    ) : null;

  return (
    <>
      <div className='lesson-attachments'>{attachmentButton}</div>
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
        disabled={userContext.role !== RoleType.Administrator}
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
