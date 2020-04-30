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

  const handleLogout = async (): Promise<void> => {
    const storageService = new StorageService();
    storageService.clearStorage();

    onCancel();
    await userContext.refreshUserData();
    history.push('/');
  };

  return <p onClick={handleLogout}>{t('drawer.log out')}</p>;
};

export default withRouter(Logout);
