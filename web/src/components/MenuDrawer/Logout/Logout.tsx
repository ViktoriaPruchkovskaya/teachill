import * as React from 'react';
import { TFunction } from 'i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../../contexts/userContext';
import { StorageService } from '../../../services/storageService';

interface LogoutProps extends RouteComponentProps {
  t: TFunction;
  onCancel(): void;
}

const Logout: React.FC<LogoutProps> = ({ t, onCancel, history }) => {
  const userContext = useContext(UserContext);

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
