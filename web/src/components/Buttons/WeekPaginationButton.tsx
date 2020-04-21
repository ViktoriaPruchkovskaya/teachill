import * as React from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface WeekPaginationButtonProps {
  direction: 'next' | 'prev';
  onClick(event: React.MouseEvent): void;
}

export const WeekPaginationButton: React.FC<WeekPaginationButtonProps> = ({
  direction,
  onClick,
}) => {
  const isNext = direction === 'next';
  return <Button onClick={onClick}>{isNext ? <RightOutlined /> : <LeftOutlined />}</Button>;
};
