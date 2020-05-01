import * as React from 'react';
import { useMembersData } from '../hooks/membersData';
import { MemberList } from '../components/MemberList/MemberList';
import { SignupUserButton } from '../components/Signup/User/SignupUserButton';
import { MembersContext } from '../contexts/membersContext';
import './ManageUsersPage.less';

export const ManageUsersPage: React.FC = () => {
  const [members, refreshMembers] = useMembersData();

  return (
    <MembersContext.Provider value={{ members: members, refreshMembers: refreshMembers }}>
      <div className='manage-page-container'>
        <div className='manage-page-content-container'>
          <div className='manage-page-list'>
            <MemberList members={members} />
          </div>
          <div className='manage-page-options'>
            <SignupUserButton />
          </div>
        </div>
      </div>
    </MembersContext.Provider>
  );
};
