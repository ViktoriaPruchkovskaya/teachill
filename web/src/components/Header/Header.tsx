import * as React from 'react';
import { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { PageHeader } from 'antd';
import './Header.less';
import { UserOutlined } from '@ant-design/icons';

export const Header = () => {
  const context = useContext(UserContext);

  const content = context.username ? (
    <div className='sidebar-container'>
      <div className='header-user-container'>
        <span className='header-username'>{context.username}</span>
        <i className='header-user-group'>{context.group}</i>
      </div>
      <div className='icon'>
        <UserOutlined />
      </div>
    </div>
  ) : null;

  return (
    <div className='header'>
      <PageHeader title='Teachill' extra={content} />
    </div>
  );
};
