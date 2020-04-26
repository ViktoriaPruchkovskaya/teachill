import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { StartPage } from './StartPage';
import { UserService } from '../services/userService';
import { UserContext } from '../contexts/userContext';
import { StorageService } from '../services/storageService';
import { Header } from '../components/Header/Header';
import { SchedulePage } from './SchedulePage';
import './App.less';
import { useUserData } from '../hooks/userData';

export const App = () => {
  const [user, refreshUser] = useUserData();

  return (
    <UserContext.Provider
      value={{
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
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
