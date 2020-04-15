import * as React from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

interface PrevWeekButtonProps {
  prevWeekSwitch(): void;
}

export const PrevWeekButton: React.FC<PrevWeekButtonProps> = ({ prevWeekSwitch }) => {
  return (
    <Button onClick={prevWeekSwitch}>
      <LeftOutlined />
    </Button>
  );
};
