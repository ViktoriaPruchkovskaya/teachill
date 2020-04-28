import * as React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { UserContextProps as UserContextModel } from '../../contexts/userContext';
import './UserInfo.less';

interface SidebarProps {
  onClick(event: React.MouseEvent): void;
  context: UserContextModel;
}

export const UserInfo: React.FC<SidebarProps> = ({ onClick, context }) => {
  return (
    <div className='sidebar-container' onClick={onClick}>
      <div className='header-user-container'>
        <span className='header-full-name'>{context.fullName}</span>
        <i className='header-user-group'>{context.group}</i>
      </div>
      <div className='icon'>
        <UserOutlined />
      </div>
    </div>
  );
};
