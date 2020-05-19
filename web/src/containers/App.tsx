import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StartPage } from './StartPage';
import { UserContext } from '../contexts/userContext';
import { Header } from '../components/Header/Header';
import { SchedulePage } from './SchedulePage';
import { ManageUsersPage } from './ManageUsersPage';
import { useUserData } from '../hooks/userData';
import { ConfigProvider } from 'antd';
import ruRu from 'antd/es/locale/ru_RU';
import enUs from 'antd/es/locale/en_US';
import './App.less';

export const App = () => {
  const { i18n } = useTranslation();
  const [user, refreshUser] = useUserData();

  return (
    <ConfigProvider locale={i18n.language == 'ru-RU' ? ruRu : enUs}>
      <UserContext.Provider
        value={{
          fullName: user.fullName,
          username: user.username,
          role: user.role,
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
    </ConfigProvider>
  );
};

export default App;
