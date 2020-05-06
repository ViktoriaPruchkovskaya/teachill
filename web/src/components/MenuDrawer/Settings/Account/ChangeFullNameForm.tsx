import * as React from 'react';
import { Button, Form, Input } from 'antd';
import { ChangeFullNameData } from './AccountModal';
import { useTranslation } from 'react-i18next';

interface ChangeFullNameFormProps {
  currentFullName: string;
  onSubmit(values: ChangeFullNameData): Promise<void>;
}

export const ChangeFullNameForm: React.FC<ChangeFullNameFormProps> = ({
  currentFullName,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Form layout='vertical' form={form} initialValues={{ fullName: currentFullName }}>
      <Form.Item name='fullName'>
        <Input placeholder={t('forms.full_name')} />
      </Form.Item>
      <Form.Item colon={false}>
        <Button
          type='primary'
          htmlType='submit'
          onClick={() =>
            onSubmit(form.getFieldsValue() as ChangeFullNameData).then(() => form.resetFields())
          }
        >
          {t('forms.confirm')}
        </Button>
      </Form.Item>
    </Form>
  );
};
