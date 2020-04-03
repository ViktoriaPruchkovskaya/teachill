import * as React from 'react';
import { Registration } from '../components/Registration/RegistrationBtn';
import { Authorization } from '../components/Authorization/AuthorizationBtn';

export const MainPage = () => {
  return (
    <React.Fragment>
      <Registration />
      <Authorization />
    </React.Fragment>
  );
};
