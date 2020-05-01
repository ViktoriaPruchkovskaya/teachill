import * as React from 'react';
import { RoleType } from '../../../services/authService';

interface ChangeRoleButtonProps {
  role: string | RoleType;
  onClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
}

export const ChangeRoleButton: React.FC<ChangeRoleButtonProps> = ({ role, onClick }) => {
  return <p onClick={onClick}>{role}</p>;
};
