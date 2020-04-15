import * as React from 'react';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

interface NextWeekButtonProps {
  nextWeekSwitch(): void;
}

export const NextWeekButton: React.FC<NextWeekButtonProps> = ({ nextWeekSwitch }) => {
  return (
    <Button onClick={nextWeekSwitch}>
      <RightOutlined />
    </Button>
  );
};
