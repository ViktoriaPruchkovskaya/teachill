import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SigninData } from './AuthorizationBtn';

interface SigninProps {
  form: FormInstance;
  visible: boolean;
  onSubmit(values: SigninData): Promise<void>;
  onCancel(): void;
}

export const AuthorizationForm: React.FC<SigninProps> = ({ form, visible, onSubmit, onCancel }) => {
  return (
    <Modal
      visible={visible}
      title='Authorization'
      onOk={() => onSubmit(form.getFieldsValue() as SigninData)}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item label='Username' name='username'>
          <Input />
        </Form.Item>
        <Form.Item label='Password' name='password'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
