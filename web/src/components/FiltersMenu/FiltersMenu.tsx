import * as React from 'react';
import { SubgroupFilter } from './SubgroupFilter/SubgroupFilter';
import './FiltersMenu.less';

export const FiltersMenu: React.FC = () => {
  return (
    <div className='filters-menu-container'>
      <SubgroupFilter />
    </div>
  );
};
