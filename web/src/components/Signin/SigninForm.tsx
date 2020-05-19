import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SigninData } from './Signin';
import { useTranslation } from 'react-i18next';

interface SigninProps {
  form: FormInstance;
  visible: boolean;
  onSubmit(values: SigninData): Promise<void>;
  onCancel(event: React.MouseEvent): void;
}

export const SigninForm: React.FC<SigninProps> = ({ form, visible, onSubmit, onCancel }) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      title={t('forms.log_in')}
      onOk={() => onSubmit(form.getFieldsValue() as SigninData)}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item name='username'>
          <Input placeholder={t('forms.username')} />
        </Form.Item>
        <Form.Item name='password'>
          <Input.Password placeholder={t('forms.password')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
