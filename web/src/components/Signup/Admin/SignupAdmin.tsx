import * as React from 'react';
import { useState, useContext } from 'react';
import { Button, Form, message } from 'antd';
import { SignupAdminForm } from './SignupAdminForm';
import { AuthService } from '../../../services/authService';
import { History } from 'history';
import { UserContext } from '../../../contexts/userContext';

export interface SignupData {
  fullName: string;
  username: string;
  password: string;
  role: number;
  name: string;
}

interface SignupAdminProps {
  history: History;
}

export const SignupAdmin: React.FC<SignupAdminProps> = ({ history }) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const userContext = useContext(UserContext);
  const [form] = Form.useForm();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  const handleSubmit = async (values: SignupData): Promise<void> => {
    try {
      const authService = new AuthService();
      await authService.signupAdmin(values);

      await userContext.refreshUserData();
      history.push('/schedule');
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div>
      <Button block type='primary' size='large' onClick={toggleModal}>
        Create an account
      </Button>
      <SignupAdminForm
        form={form}
        visible={visibility}
        onSubmit={handleSubmit}
        onCancel={toggleModal}
      />
    </div>
  );
};
