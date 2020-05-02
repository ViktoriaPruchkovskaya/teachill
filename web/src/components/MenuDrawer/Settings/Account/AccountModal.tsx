import * as React from 'react';
import { Collapse, Form, message, Modal } from 'antd';
import { ChangePasswordForm } from './ChangePasswordForm';
import { UserService } from '../../../../services/userService';
import './AccountModal.less';

interface AccountModalProps {
  visible: boolean;
  onCancel(event: React.MouseEvent): void;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
export const AccountModal: React.FC<AccountModalProps> = ({ visible, onCancel }) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm();

  const handleChangePassword = async (values: ChangePasswordData): Promise<void> => {
    try {
      const userService = new UserService();
      await userService.changePassword(values);

      form.resetFields();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      visible={visible}
      title='Account settings'
      onCancel={onCancel}
      footer={null}
      className='account-modal-container'
    >
      <Collapse accordion defaultActiveKey={['1']}>
        <Panel header='Change password' key='1'>
          <ChangePasswordForm onSubmit={handleChangePassword} form={form} />
        </Panel>
        <Panel header='Change full name' key='2'>
          <p>{text}</p>
        </Panel>
      </Collapse>
    </Modal>
  );
};
