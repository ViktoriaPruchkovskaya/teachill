import * as React from 'react';
import { Drawer } from 'antd';
import { UserContextProps as UserContextModel } from '../../contexts/userContext';
import { useTranslation } from 'react-i18next';
import Logout from './Logout/Logout';
import './MenuDrawer.less';

interface MenuDrawerProps {
  onClick(): void;
  context: UserContextModel;
  visibility: boolean;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ onClick, context, visibility }) => {
  const { t } = useTranslation();
  return (
    <Drawer
      title={
        <div>
          <p>{context.fullName}</p>
          <p className='drawer-username'>@{context.username}</p>
        </div>
      }
      placement='right'
      closable={false}
      onClose={onClick}
      visible={visibility}
    >
      <p>{t('drawer.settings')}</p>
      <p>{t('drawer.info')}</p>
      <Logout onCancel={onClick} />
    </Drawer>
  );
};
