import * as React from 'react';

export interface UserContextProps {
  username: string;
  group: string;
  refreshUserData: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextProps>(null);
