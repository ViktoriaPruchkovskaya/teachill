import * as React from 'react';
import { useState } from 'react';
import { List } from 'antd';
import { User } from '../../services/userService';
import { MemberListItem } from './MemberListItem';
import { ListItemMenu } from './ListItemMenu/ListItemMenu';

interface MemberListProps {
  members: User[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  const [member, setMember] = useState<User>({
    id: null,
    fullName: null,
    username: null,
    role: null,
  });

  const handleClick = (item: JSX.Element): void => {
    const user = item.props.member;
    setMember({ id: user.id, username: user.username, fullName: user.fullName, role: user.role });
  };

  const membersList = members.map(member => <MemberListItem key={member.id} member={member} />);

  return (
    <List
      bordered
      dataSource={membersList}
      renderItem={item => (
        <List.Item>
          {item}
          <ListItemMenu onClick={() => handleClick(item)} member={member} />
        </List.Item>
      )}
    />
  );
};
