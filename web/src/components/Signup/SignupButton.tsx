import * as React from 'react';
import { useState } from 'react';
import { Button, Form, message } from 'antd';
import { SignupForm } from './SignupForm';
import { AuthService } from '../../services/authService';
import { GroupService } from '../../services/groupService';

export interface SignupData {
  fullName: string;
  username: string;
  password: string;
  role: number;
  name: string;
}

export const SignupButton: React.FC = () => {
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
    } catch (error) {
      message.error(error.message);
    }
    form.resetFields();
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
