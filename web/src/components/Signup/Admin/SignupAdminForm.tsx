import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SignupData } from './SignupAdmin';

interface SignupAdminProps {
  form: FormInstance;
  visible: boolean;
  onSubmit(values: SignupData): Promise<void>;
  onCancel(event: React.MouseEvent): void;
}

export const SignupAdminForm: React.FC<SignupAdminProps> = ({
  form,
  visible,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      title='Create an account'
      onOk={() => onSubmit(form.getFieldsValue() as SignupData)}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item name='fullName'>
          <Input placeholder='Full Name' />
        </Form.Item>
        <Form.Item name='username'>
          <Input placeholder='Username' />
        </Form.Item>
        <Form.Item name='password'>
          <Input.Password placeholder='Password' />
        </Form.Item>
        <Form.Item name='name'>
          <Input placeholder='Group' />
        </Form.Item>
      </Form>
    </Modal>
  );
};