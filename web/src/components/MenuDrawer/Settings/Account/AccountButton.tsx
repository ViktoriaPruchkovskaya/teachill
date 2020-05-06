import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountModal } from './AccountModal';

export const AccountButton: React.FC = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const { t } = useTranslation();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  return (
    <>
      <p onClick={toggleModal}>{t('settings.account')}</p>
      <AccountModal visible={visibility} onCancel={toggleModal} />
    </>
  );
};
