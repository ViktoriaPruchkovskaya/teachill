import * as React from 'react';
import { Drawer, Divider } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { FileUpload } from './FileUpload';
import { AttachLinkForm } from './AttachLinkForm';
import { Lesson } from '../../services/groupService';
import { useTranslation } from 'react-i18next';
import './AttachDrawer.less';

interface AttachDrawerProps {
  visibility: boolean;
  onClick(): void;
  files: UploadFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  lesson: Lesson;
}

const DRAWER_WIDTH = 270;

export const AttachDrawer: React.FC<AttachDrawerProps> = ({
  visibility,
  onClick,
  files,
  setFiles,
  lesson,
}) => {
  const { t } = useTranslation();

  return (
    <Drawer
      title={t('attachments.attach_from')}
      placement='right'
      closable={true}
      onClose={onClick}
      visible={visibility}
      mask={false}
      width={DRAWER_WIDTH}
    >
      <div className='drawer-menu'>
        <FileUpload files={files} setFiles={setFiles} lesson={lesson} />
        <Divider />
        <AttachLinkForm files={files} setFiles={setFiles} lesson={lesson} />
      </div>
    </Drawer>
  );
};
