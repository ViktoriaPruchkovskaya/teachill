import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { SignupAdmin } from '../components/Signup/Admin/SignupAdmin';
import { Signin } from '../components/Signin/Signin';
import { useTranslation } from 'react-i18next';
import './StartPage.less';

export const StartPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { t } = useTranslation();

  return (
    <div className='start-page-container'>
      <div className='start-page-content-container'>
        <div>
          <p>{t('start_page.description')}</p>
        </div>
        <div className='auth-select-container'>
          <SignupAdmin history={history} />
          <Signin history={history} />
        </div>
      </div>
    </div>
  );
};
