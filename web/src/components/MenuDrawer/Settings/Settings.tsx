import * as React from 'react';
import { useContext } from 'react';
import { Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { ChangeLanguage } from './ChangeLanguage/ChangeLanguage';
import ManageUsers from './ManageUsersButton';
import { AccountButton } from './Account/AccountButton';
import { UpdateScheduleButton } from './UpdateScheduleButton';
import { UserContext } from '../../../contexts/userContext';
import { RoleType } from '../../../services/authService';

interface SettingsProps {
  onCancel(): void;
}

export const Settings: React.FC<SettingsProps> = ({ onCancel }) => {
  const { t } = useTranslation();
  const userContext = useContext(UserContext);
  const { Panel } = Collapse;

  const settings =
    userContext.role === RoleType.Administrator ? (
      <>
        <UpdateScheduleButton />
        <ManageUsers onCancel={onCancel} />
        <AccountButton />
        <ChangeLanguage />
      </>
    ) : (
      <>
        <AccountButton />
        <ChangeLanguage />
      </>
    );

  return (
    <Collapse bordered={false} expandIconPosition='right' className='drawer-settings'>
      <Panel header={t('drawer.settings')} key='1' className='drawer-settings'>
        {settings}
      </Panel>
    </Collapse>
  );
};
