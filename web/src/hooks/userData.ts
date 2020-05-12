import { UserService } from '../services/userService';
import { message } from 'antd';
import { StorageService } from '../services/storageService';
import { useEffect, useState } from 'react';
import { GroupService } from '../services/groupService';

interface UserData {
  fullName?: string;
  username?: string;
  role?: number;
  groupName?: string;
}

export function useUserData(): [UserData, () => Promise<void>] {
  const [user, setUser] = useState<UserData>({});

  async function refreshUser(): Promise<void> {
    const storageService = new StorageService();
    const tokenAvailable = storageService.isTokenInStorage();
    if (!tokenAvailable) {
      setUser({});
      return;
    }

    try {
      const userService = new UserService();
      const groupService = new GroupService();
      const results = await Promise.all([
        userService.getCurrentUser(),
        groupService.getCurrentGroup(),
      ]);

      setUser({
        fullName: results[0].fullName,
        username: results[0].username,
        role: results[0].role,
        groupName: results[1].name,
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  useEffect(() => {
    (async function() {
      const storageService = new StorageService();
      const tokenAvailable = storageService.isTokenInStorage();
      if (tokenAvailable) {
        await refreshUser();
      }
    })();
  }, []);

  return [user, refreshUser];
}
