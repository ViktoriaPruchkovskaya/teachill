import * as React from 'react';
import { useContext } from 'react';
import { message } from 'antd';
import { User, UserService } from '../../../services/userService';
import { MembersContext } from '../../../contexts/membersContext';
import { useTranslation } from 'react-i18next';

interface DeleteUserButtonProps {
  member: User;
}

export const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ member }) => {
  const membersContext = useContext(MembersContext);
  const { t } = useTranslation();

  const handleClick = async () => {
    try {
      const userService = new UserService();
      await userService.deleteUser(member);
      await membersContext.refreshMembers();
    } catch (error) {
      message.error(error.message);
    }
  };

  return <p onClick={handleClick}> {t('manage page.delete')}</p>;
};
