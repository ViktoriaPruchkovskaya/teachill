import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SigninData } from './Signin';

interface SigninProps {
  form: FormInstance;
  visible: boolean;
  onSubmit(values: SigninData): Promise<void>;
  onCancel(event: React.MouseEvent): void;
}

export const SigninForm: React.FC<SigninProps> = ({ form, visible, onSubmit, onCancel }) => {
  return (
    <Modal
      visible={visible}
      title='Log in'
      onOk={() => onSubmit(form.getFieldsValue() as SigninData)}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item name='username'>
          <Input placeholder='Username' />
        </Form.Item>
        <Form.Item name='password'>
          <Input placeholder='Password' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
