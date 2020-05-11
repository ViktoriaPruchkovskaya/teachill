import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoModal } from './InfoModal';

export const InfoButton: React.FC = () => {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState<boolean>(false);

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  return (
    <>
      <p onClick={toggleModal}>{t('drawer.info')}</p>
      <InfoModal visibility={visibility} onCancel={toggleModal} />
    </>
  );
};
