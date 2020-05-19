import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SignupData } from './SignupAdmin';
import { useTranslation } from 'react-i18next';

interface SignupAdminProps {
  form: FormInstance;
  loading: boolean;
  visible: boolean;
  onSubmit(values: SignupData): Promise<void>;
  onCancel(event: React.MouseEvent): void;
}

export const SignupAdminForm: React.FC<SignupAdminProps> = ({
  form,
  loading,
  visible,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      title={t('forms.create_an_account')}
      onOk={() => onSubmit(form.getFieldsValue() as SignupData)}
      confirmLoading={loading}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item name='fullName'>
          <Input placeholder={t('forms.full_name')} />
        </Form.Item>
        <Form.Item name='username'>
          <Input placeholder={t('forms.username')} />
        </Form.Item>
        <Form.Item name='password'>
          <Input.Password placeholder={t('forms.password')} />
        </Form.Item>
        <Form.Item name='name'>
          <Input placeholder={t('forms.group')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
