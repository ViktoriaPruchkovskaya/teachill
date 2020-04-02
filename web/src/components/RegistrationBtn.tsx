import * as React from 'react';
import { useState } from 'react';
import { Button, Form } from 'antd';
import { RegistrationForm } from './RegistrationForm';

export interface SignupData {
  fullName: string;
  username: string;
  password: string;
  role: number;
  name: string;
}

export const Registration = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [form] = Form.useForm();

  const showModal = (): void => {
    setVisibility(true);
  };

  const handleCancel = (): void => {
    setVisibility(false);
  };

  const handleSubmit = async (values: SignupData): Promise<void> => {
    values.role = 1;
    const signupData = JSON.stringify(values);

    const user = await fetch('/api/signup/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: signupData,
    });
    const { userId } = await user.json();

    const signinUser = await fetch('/api/signin/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: signupData,
    });
    const { token } = await signinUser.json();

    const group = await fetch('/api/groups/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: signupData,
    });
    const { groupId } = await group.json();

    await fetch(`/groups/${groupId}/users/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ userId: userId }),
    });

    form.resetFields();
  };
  return (
    <div>
      <Button type='primary' onClick={showModal}>
        Sign up
      </Button>
      <RegistrationForm
        form={form}
        visible={visibility}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};
