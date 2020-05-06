import * as React from 'react';

interface ChangeRoleButtonProps {
  role: string;
  onClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
}

export const ChangeRoleButton: React.FC<ChangeRoleButtonProps> = ({ role, onClick }) => {
  return <p onClick={onClick}>{role}</p>;
};
