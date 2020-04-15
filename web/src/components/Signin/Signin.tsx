import * as React from 'react';
import { useState } from 'react';
import { Form, Button, message } from 'antd';
import { SigninForm } from './SigninForm';
import { AuthService } from '../../services/authService';
import { History } from 'history';
import { LocalStorageService } from '../../services/localStorageService';

export interface SigninData {
  username: string;
  password: string;
}
interface SigninProps {
  history: History;
}

export const Signin: React.FC<SigninProps> = ({ history }) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [form] = Form.useForm();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  const handleSubmit = async (values: SigninData): Promise<void> => {
    try {
      const authService = new AuthService();
      const token = await authService.signin(values);
      new LocalStorageService().setToken(token);
      history.push('/schedule');
    } catch (error) {
      form.resetFields();
      message.error(error.message);
    }
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
