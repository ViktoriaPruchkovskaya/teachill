import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ScheduleContext } from '../../../contexts/scheduleContext';
import { StorageService } from '../../../services/storageService';
import { useTranslation } from 'react-i18next';

export const SubgroupFilter: React.FC = () => {
  const { t } = useTranslation();
  const scheduleContext = useContext(ScheduleContext);
  const [subgroups, setSubgroups] = useState<Array<number>>([]);

  useEffect(() => {
    (function() {
      const storageService = new StorageService();
      const subgroupsArray = storageService.getSubgroups();
      setSubgroups(subgroupsArray);
    })();
  }, []);

  const menu = (
    <Menu>
      {subgroups.map((subgroup, index) => (
        <Menu.Item onClick={() => handleClick(subgroup)} key={index}>
          {subgroup
            ? `${subgroup}${t('schedule_page.subgroup_order')}`
            : `${t('schedule_page.full_schedule')}`}
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleClick = (value: number): void => {
    (async function() {
      await scheduleContext.refreshSchedule(value);
    })();
  };

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a>
        {t('schedule_page.subgroup_filter_button')}
        <DownOutlined />
      </a>
    </Dropdown>
  );
};
