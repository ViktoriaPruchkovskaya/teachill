import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SignupData } from './RegistrationBtn';

interface SignupProps {
  form: FormInstance;
  visible: boolean;
  onSubmit(values: SignupData): Promise<void>;
  onCancel(): void;
}

export const RegistrationForm: React.FC<SignupProps> = ({ form, visible, onSubmit, onCancel }) => {
  return (
    <Modal
      visible={visible}
      title='Registration'
      onOk={() => onSubmit(form.getFieldsValue() as SignupData)}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item label='Full Name' name='fullName'>
          <Input />
        </Form.Item>
        <Form.Item label='Username' name='username'>
          <Input />
        </Form.Item>
        <Form.Item label='Password' name='password'>
          <Input />
        </Form.Item>
        <Form.Item label='Group' name='name'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
