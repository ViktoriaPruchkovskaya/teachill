import * as React from 'react';
import { useContext } from 'react';
import { Collapse, Form, message, Modal } from 'antd';
import { ChangePasswordForm } from './ChangePasswordForm';
import { UserService } from '../../../../services/userService';
import { useTranslation } from 'react-i18next';
import { ChangeFullNameForm } from './ChangeFullNameForm';
import { UserContext } from '../../../../contexts/userContext';

interface AccountModalProps {
  visible: boolean;
  onCancel(event: React.MouseEvent): void;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeFullNameData {
  fullName: string;
}

export const AccountModal: React.FC<AccountModalProps> = ({ visible, onCancel }) => {
  const userContext = useContext(UserContext);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { Panel } = Collapse;

  const handleChangePassword = async (values: ChangePasswordData): Promise<void> => {
    try {
      const userService = new UserService();
      await userService.changePassword(values);

      form.resetFields();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleChangeFullName = async (values: ChangeFullNameData): Promise<void> => {
    try {
      if (values.fullName === userContext.fullName || values.fullName.length === 0) {
        return;
      }
      console.log(values);
      const userService = new UserService();
      await userService.changeFullName(values);

      await userContext.refreshUserData();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      visible={visible}
      title={t('forms.account')}
      onCancel={onCancel}
      footer={null}
      className='account-modal-container'
    >
      <Collapse accordion defaultActiveKey={['1']}>
        <Panel header={t('forms.change_password')} key='1'>
          <ChangePasswordForm onSubmit={handleChangePassword} form={form} />
        </Panel>
        <Panel header={t('forms.change_full_name')} key='2'>
          <ChangeFullNameForm
            currentFullName={userContext.fullName}
            onSubmit={handleChangeFullName}
          />
        </Panel>
      </Collapse>
    </Modal>
  );
};
