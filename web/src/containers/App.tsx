import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { StartPage } from './StartPage';
import { UserContext } from '../contexts/userContext';
import { Header } from '../components/Header/Header';
import { SchedulePage } from './SchedulePage';
import { ManageUsersPage } from './ManageUsersPage';
import { useUserData } from '../hooks/userData';
import './App.less';

export const App = () => {
  const [user, refreshUser] = useUserData();

  return (
    <UserContext.Provider
      value={{
        fullName: user.fullName,
        username: user.username,
        group: user.groupName,
        refreshUserData: refreshUser,
      }}
    >
      <Router>
        <div className='root-container'>
          <Header />
          <Route path='/' exact component={StartPage} />
          <Route path='/schedule' component={SchedulePage} />
          <Route path='/manage-users' component={ManageUsersPage} />
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
