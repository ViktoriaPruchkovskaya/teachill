import * as React from 'react';
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import { PageHeader } from 'antd';
import { UserInfo } from './UserInfo';
import { MenuDrawer } from '../MenuDrawer/MenuDrawer';
import './Header.less';

export const Header: React.FC = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const context = useContext(UserContext);

  const toggleDrawer = (): void => {
    setVisibility(!visibility);
  };

  const content = context.username ? (
    <div className='header-container'>
      <UserInfo onClick={toggleDrawer} context={context} />
    </div>
  ) : null;

  return (
    <div className='header'>
      <PageHeader title='Teachill' extra={content} />
      <MenuDrawer onClick={toggleDrawer} context={context} visibility={visibility} />
    </div>
  );
};
