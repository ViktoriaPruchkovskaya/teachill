import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { SignupData } from './SignupUserButton';
import { FormInstance } from 'antd/lib/form';
import { useTranslation } from 'react-i18next';

interface SignupUserModalProps {
  form: FormInstance;
  visible: boolean;
  onSubmit(values: SignupData): Promise<void>;
  onCancel(event: React.MouseEvent): void;
}
export const SignupUserModal: React.FC<SignupUserModalProps> = ({
  form,
  visible,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      title={t('forms.add_user')}
      onOk={() => onSubmit(form.getFieldsValue() as SignupData)}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item name='fullName'>
          <Input placeholder={t('forms.fullName')} />
        </Form.Item>
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
