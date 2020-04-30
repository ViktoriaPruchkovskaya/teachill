import * as React from 'react';
import { useState } from 'react';
import { Button, Form, message } from 'antd';
import { AuthService } from '../../../services/authService';
import { SignupUserForm } from './SignupUserForm';
import { useTranslation } from 'react-i18next';

export interface SignupData {
  fullName: string;
  username: string;
  password: string;
  role: number;
  name: string;
}

interface SignupUserProps {
  refreshMembers(): Promise<void>;
}

export const SignupUser: React.FC<SignupUserProps> = ({ refreshMembers }) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  const handleSubmit = async (values: SignupData): Promise<void> => {
    try {
      const authService = new AuthService();
      await authService.signupUser(values);

      toggleModal();
      form.resetFields();
      await refreshMembers();
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div>
      <Button block size='large' onClick={toggleModal}>
        {t('manage page.add user button')}
      </Button>
      <SignupUserForm
        form={form}
        visible={visibility}
        onSubmit={handleSubmit}
        onCancel={toggleModal}
      />
    </div>
  );
};
