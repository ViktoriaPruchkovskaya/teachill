import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer } from 'antd';
import { UserContext, UserContextProps as UserContextModel } from '../../contexts/userContext';
import { Settings } from './Settings/Settings';
import Logout from './Logout/Logout';
import { RoleType } from '../../services/authService';
import './MenuDrawer.less';

interface MenuDrawerProps {
  onClick(): void;
  context: UserContextModel;
  visibility: boolean;
}

const DRAWER_WIDTH = 270;

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ onClick, context, visibility }) => {
  const { t } = useTranslation();
  const userContext = useContext(UserContext);

  return (
    <Drawer
      title={
        <div>
          <p>
            {context.fullName} {userContext.role === RoleType.Administrator ? '⭐' : ''}
          </p>
          <p className='drawer-username'>@{context.username}</p>
        </div>
      }
      placement='right'
      closable={false}
      onClose={onClick}
      visible={visibility}
      width={DRAWER_WIDTH}
    >
      <div className='drawer-options'>
        <Settings onCancel={onClick} />
        <p>{t('drawer.info')}</p>
        <Logout onCancel={onClick} />
      </div>
    </Drawer>
  );
};
