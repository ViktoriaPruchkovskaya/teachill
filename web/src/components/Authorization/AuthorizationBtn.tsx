import * as React from 'react';
import { useState } from 'react';
import { Form, Button } from 'antd';
import { AuthorizationForm } from './AuthorizationForm';

export interface SigninData {
  username: string;
  password: string;
}

export const Authorization: React.FC<{}> = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [form] = Form.useForm();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  const handleSubmit = async (values: SigninData): Promise<void> => {
    const signinUser = await fetch('/api/signin/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    const { token } = await signinUser.json();

    form.resetFields();
  };
  return (
    <div>
      <Button type='primary' onClick={toggleModal}>
        Sign in
      </Button>
      <AuthorizationForm
        form={form}
        visible={visibility}
        onSubmit={handleSubmit}
        onCancel={toggleModal}
      />
    </div>
  );
};
