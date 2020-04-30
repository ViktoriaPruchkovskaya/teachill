import * as React from 'react';
import { List } from 'antd';
import { useMembersData } from '../hooks/membersData';
import { SignupUser } from '../components/Signup/User/SignupUser';
import './ManagePage.less';

export const ManagePage: React.FC = () => {
  const [members, refreshMembers] = useMembersData();

  const content =
    members.length > 0
      ? members.map(member => {
          return <span key={member.id}>{member.fullName}</span>;
        })
      : [];

  return (
    <div className='manage-page-container'>
      <div className='manage-page-content-container'>
        <div className='manage-page-list'>
          <List bordered dataSource={content} renderItem={item => <List.Item>{item}</List.Item>} />
        </div>
        <div className='manage-page-options'>
          <SignupUser refreshMembers={refreshMembers} />
        </div>
      </div>
    </div>
  );
};
