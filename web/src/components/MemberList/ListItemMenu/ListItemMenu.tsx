import * as React from 'react';
import { Dropdown, Menu } from 'antd';
import { ListItemMenuButton } from './ListItemMenuButton';
import { DeleteUserButton } from './DeleteUserButton';
import { User } from '../../../services/userService';

interface ListItemMenuProps {
  onClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
  member: User;
}

export const ListItemMenu: React.FC<ListItemMenuProps> = ({ onClick, member }) => {
  const menu = (
    <Menu>
      <Menu.Item key='0'>
        <DeleteUserButton member={member} />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement='bottomCenter'>
      <ListItemMenuButton onClick={onClick} />
    </Dropdown>
  );
};
