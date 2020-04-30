import * as React from 'react';
import { Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { ChangeLanguage } from './ChangeLanguage/ChangeLanguage';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { Panel } = Collapse;

  return (
    <Collapse bordered={false} expandIconPosition='right' className='drawer-settings'>
      <Panel header={t('drawer.settings')} key='1' className='drawer-settings'>
        <p>{t('settings.update schedule')}</p>
        <p>{t('settings.manage users')}</p>
        <p>{t('settings.users permissions')}</p>
        <ChangeLanguage />
      </Panel>
    </Collapse>
  );
};
