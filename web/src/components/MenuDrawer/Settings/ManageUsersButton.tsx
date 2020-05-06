import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface ManageUsersButtonProps extends RouteComponentProps {
  onCancel(): void;
}

const ManageUsersButton: React.FC<ManageUsersButtonProps> = ({ onCancel, history }) => {
  const { t } = useTranslation();

  const handleClick = (): void => {
    onCancel();
    history.push('/manage-users');
  };

  return <p onClick={handleClick}>{t('settings.manage_users')}</p>;
};

export default withRouter(ManageUsersButton);
