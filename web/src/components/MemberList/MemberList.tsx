import * as React from 'react';
import { List } from 'antd';
import { User } from '../../services/userService';
import { MemberListItem } from './MemberListItem';

interface MemberListProps {
  members: User[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  const membersList = members.map(member => <MemberListItem key={member.id} member={member} />);

  return (
    <List bordered dataSource={membersList} renderItem={item => <List.Item>{item}</List.Item>} />
  );
};
