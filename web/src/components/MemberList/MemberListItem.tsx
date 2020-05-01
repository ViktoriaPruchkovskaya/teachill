import * as React from 'react';
import { User } from '../../services/userService';
import { RoleType } from '../../services/authService';

interface MemberListItemProps {
  member: User;
}

export const MemberListItem: React.FC<MemberListItemProps> = ({ member }) => {
  const listItem = `${member.fullName} ${member.role === RoleType.Administrator ? '⭐' : ''}`;
  return <span>{listItem}</span>;
};
