import * as React from 'react';
import { useContext } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ListItemMenuButton } from './ListItemMenuButton';
import { DeleteUserButton } from './DeleteUserButton';
import { User, UserService } from '../../../services/userService';
import { RoleType } from '../../../services/authService';
import { ChangeRoleButton } from './ChangeRoleButton';
import { MembersContext } from '../../../contexts/membersContext';

interface ListItemMenuProps {
  onClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
  member: User;
}

export const ListItemMenu: React.FC<ListItemMenuProps> = ({ onClick, member }) => {
  const { t } = useTranslation();
  const membersContext = useContext(MembersContext);
  const { SubMenu } = Menu;

  const changeRoleHandler = async (role: keyof typeof RoleType): Promise<void> => {
    try {
      const userService = new UserService();
      await userService.changeRole({ userId: member.id, roleId: RoleType[role] });

      await membersContext.refreshMembers();
    } catch (error) {
      message.error(error.message);
    }
  };

  const roleList = Object.values(RoleType)
    .filter(
      (role): role is keyof typeof RoleType =>
        typeof role === 'string' && RoleType[role as keyof typeof RoleType] !== member.role
    )
    .map((role, index) => (
      <Menu.Item key={index}>
        <ChangeRoleButton role={role} onClick={() => changeRoleHandler(role)} />
      </Menu.Item>
    ));

  const menu = (
    <Menu>
      <Menu.Item>
        <DeleteUserButton member={member} />
      </Menu.Item>
      <SubMenu title={t('manage_page.change_role')}>{roleList}</SubMenu>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement='bottomCenter'>
      <ListItemMenuButton onClick={onClick} />
    </Dropdown>
  );
};
