import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface ManageUsersProps extends RouteComponentProps {
  onCancel(): void;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ onCancel, history }) => {
  const { t } = useTranslation();

  const handleClick = (): void => {
    onCancel();
    history.push('/manage-users');
  };

  return <p onClick={handleClick}>{t('settings.manage users')}</p>;
};

export default withRouter(ManageUsers);
