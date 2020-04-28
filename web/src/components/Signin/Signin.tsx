import * as React from 'react';
import { useContext, useState } from 'react';
import { Form, Button, message } from 'antd';
import { SigninForm } from './SigninForm';
import { AuthService } from '../../services/authService';
import { History } from 'history';
import { UserContext } from '../../contexts/userContext';

export interface SigninData {
  username: string;
  password: string;
}

interface SigninProps {
  history: History;
}

export const Signin: React.FC<SigninProps> = ({ history }) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const userContext = useContext(UserContext);
  const [form] = Form.useForm();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  const handleSubmit = async (values: SigninData): Promise<void> => {
    try {
      const authService = new AuthService();
      await authService.signin(values);

      await userContext.refreshUserData();
      history.push('/schedule');
    } catch (error) {
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
