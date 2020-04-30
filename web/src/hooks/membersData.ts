import { User } from '../services/userService';
import { useEffect, useState } from 'react';
import { GroupService } from '../services/groupService';

export function useMembersData(): [User[], () => Promise<void>] {
  const [members, setMembers] = useState<User[]>([]);

  async function refreshMembers(): Promise<void> {
    const groupService = new GroupService();
    const members = await groupService.getMembers();
    setMembers(members);
  }

  useEffect(() => {
    (async function() {
      await refreshMembers();
    })();
  }, []);

  return [members, refreshMembers];
}
