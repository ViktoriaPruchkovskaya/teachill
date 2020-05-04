import * as React from 'react';
import { Form, Input, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ChangePasswordData } from './AccountModal';
import { useTranslation } from 'react-i18next';
import './ChangePasswordForm.less';

interface ChangePasswordFormProps {
  onSubmit(values: ChangePasswordData): Promise<void>;
  form: FormInstance;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit, form }) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout='inline'>
      <Form.Item name='currentPassword' className='change-password-form-field'>
        <Input.Password placeholder={t('forms.current_password')} />
      </Form.Item>
      <Form.Item name='newPassword' className='change-password-form-field'>
        <Input.Password placeholder={t('forms.new_password')} />
      </Form.Item>
      <Form.Item colon={false}>
        <Button
          type='primary'
          htmlType='submit'
          onClick={() => onSubmit(form.getFieldsValue() as ChangePasswordData)}
        >
          {t('forms.confirm')}
        </Button>
      </Form.Item>
    </Form>
  );
};
