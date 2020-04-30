import * as React from 'react';
import { Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { ChangeLanguage } from './ChangeLanguage/ChangeLanguage';
import ManageUsers from './ManageUsers';

interface SettingsProps {
  onCancel(): void;
}

export const Settings: React.FC<SettingsProps> = ({ onCancel }) => {
  const { t } = useTranslation();
  const { Panel } = Collapse;

  return (
    <Collapse bordered={false} expandIconPosition='right' className='drawer-settings'>
      <Panel header={t('drawer.settings')} key='1' className='drawer-settings'>
        <p>{t('settings.update schedule')}</p>
        <ManageUsers onCancel={onCancel} />
        <p>{t('settings.account')}</p>
        <ChangeLanguage />
      </Panel>
    </Collapse>
  );
};
