import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { UserContext } from '../../../contexts/userContext';
import { StorageService } from '../../../services/storageService';

interface LogoutProps extends RouteComponentProps {
  onCancel(): void;
}

const Logout: React.FC<LogoutProps> = ({ onCancel, history }) => {
  const userContext = useContext(UserContext);
  const { t } = useTranslation();

  const handleLogout = (): void => {
    (async function() {
      const storageService = new StorageService();

      onCancel();
      history.push('/');

      storageService.clearStorage();
      await userContext.refreshUserData();
    })();
  };

  return <p onClick={handleLogout}>{t('drawer.log_out')}</p>;
};

export default withRouter(Logout);
