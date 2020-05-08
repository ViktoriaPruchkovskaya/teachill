import * as React from 'react';
import { Button, Form, Input, message, Tooltip } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { Lesson } from '../../services/groupService';
import { AttachmentService } from '../../services/attachmentService';
import { useTranslation } from 'react-i18next';

interface AttachLinkFormProps {
  files: UploadFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  lesson: Lesson;
}

interface LinkAttachmentData {
  name?: string;
  url: string;
}

export const AttachLinkForm: React.FC<AttachLinkFormProps> = ({ files, setFiles, lesson }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onClick = (value: LinkAttachmentData) => {
    (async function() {
      try {
        const attachmentService = new AttachmentService();
        if (!value.name) {
          value.name = value.url;
        }

        const attachmentId = await attachmentService.createAttachment({
          lessonId: lesson.id,
          name: value.name,
          url: value.url,
        });
        const fileList = [...files];
        const createdAttachment = {
          uid: attachmentId.toString(),
          size: 50,
          name: value.name,
          url: value.url,
          type: 'link',
        };
        fileList.push(createdAttachment);
        setFiles(fileList);
        form.resetFields();
      } catch (error) {
        message.error(error.message);
      }
    })();
  };

  return (
    <Form form={form}>
      <Form.Item name='url'>
        <Input placeholder={t('attachments.paste_a_link')} />
      </Form.Item>
      <Tooltip placement='left' title={t('attachments.optional')}>
        <Form.Item name='name'>
          <Input placeholder={t('attachments.link_name')} />
        </Form.Item>
      </Tooltip>
      <Button
        htmlType='submit'
        onClick={() => onClick(form.getFieldsValue() as LinkAttachmentData)}
      >
        {t('attachments.attach')}
      </Button>
    </Form>
  );
};
