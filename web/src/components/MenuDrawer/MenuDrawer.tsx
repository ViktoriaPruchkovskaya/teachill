import * as React from 'react';
import { useContext } from 'react';
import { Drawer } from 'antd';
import { UserContext, UserContextProps as UserContextModel } from '../../contexts/userContext';
import { Settings } from './Settings/Settings';
import Logout from './Logout/Logout';
import { InfoButton } from './Info/InfoButton';
import { RoleType } from '../../services/authService';
import './MenuDrawer.less';

interface MenuDrawerProps {
  onClick(): void;
  context: UserContextModel;
  visibility: boolean;
}

const DRAWER_WIDTH = 270;

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ onClick, context, visibility }) => {
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
        <InfoButton />
        <Logout onCancel={onClick} />
      </div>
    </Drawer>
  );
};
