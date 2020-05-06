import * as React from 'react';
import { MoreOutlined } from '@ant-design/icons/lib';

interface ListItemMenuButtonProps {
  onClick(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void;
}

export const ListItemMenuButton: React.FC<ListItemMenuButtonProps> = React.forwardRef(
  ({ onClick }, ref) => {
    return <MoreOutlined onClick={item => onClick(item)} />;
  }
);
