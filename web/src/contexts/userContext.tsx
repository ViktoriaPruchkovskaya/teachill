import * as React from 'react';

export interface UserContextProps {
  fullName: string;
  username: string;
  role: number;
  group: string;
  refreshUserData: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextProps>(null);
