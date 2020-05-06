import * as React from 'react';
import { User } from '../services/userService';

export interface MembersContextProps {
  members: User[];
  refreshMembers(): Promise<void>;
}

export const MembersContext = React.createContext<MembersContextProps>(null);
