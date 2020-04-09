import * as React from 'react';
import { useState } from 'react';
import { Button, Form, message } from 'antd';
import { SignupForm } from './SignupForm';
import { History } from 'history';
import { AuthService } from '../../services/authService';
import { GroupService } from '../../services/groupService';

export interface SignupData {
  fullName: string;
  username: string;
  password: string;
  role: number;
  name: string;
}

interface SignupProps {
  history: History;
}

export const SignupButton: React.FC<SignupProps> = ({ history }) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [form] = Form.useForm();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  const handleSubmit = async (values: SignupData): Promise<void> => {
    values.role = 1;

    try {
      const authService = new AuthService();
      const userId = await authService.signup(values);

      const token = await authService.signin(values);
      localStorage.setItem('teachillToken', token);

      const groupService = new GroupService(token);
      const groupId = await groupService.createGroup(values);

      await groupService.assignUserToGroup(groupId, userId);
      history.push('/schedule');
    } catch (error) {
      form.resetFields();
      message.error(error.message);
    }
  };
  return (
    <div>
      <Button block type='primary' size='large' onClick={toggleModal}>
        Create an account
      </Button>
      <SignupForm form={form} visible={visibility} onSubmit={handleSubmit} onCancel={toggleModal} />
    </div>
  );
};
