import * as React from 'react';
import { useState } from 'react';
import { Form, Button } from 'antd';
import { SigninForm } from './SigninForm';
import { AuthService } from '../../services/authService';

export interface SigninData {
  username: string;
  password: string;
}

export const SigninButton: React.FC = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [form] = Form.useForm();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  const handleSubmit = async (values: SigninData): Promise<void> => {
    const authService = new AuthService();
    const token = await authService.signin(values);
    localStorage.setItem('teachillToken', token);
    form.resetFields();
  };
  return (
    <div>
      <Button block type='primary' size='large' onClick={toggleModal}>
        Log in with an existing account
      </Button>
      <SigninForm form={form} visible={visibility} onSubmit={handleSubmit} onCancel={toggleModal} />
    </div>
  );
};
