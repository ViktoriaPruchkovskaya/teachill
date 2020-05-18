import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChangeLanguageModal } from './ChangeLanguageModal';
import { StorageService } from '../../../../services/storageService';

const languageList = {
  en: 'English',
  ru: 'Russian',
};

export const ChangeLanguage: React.FC = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const { i18n, t } = useTranslation();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  async function handleChange(language: string) {
    const storageService = new StorageService();
    storageService.setLanguage(language);
    await i18n.changeLanguage(language);
  }

  const currentLanguage = i18n.language.split('-')[0];

  return (
    <>
      <p onClick={toggleModal}>{t('settings.language')}</p>
      <ChangeLanguageModal
        visible={visibility}
        languageList={languageList}
        currentLanguage={currentLanguage}
        handleChange={handleChange}
        onSubmit={toggleModal}
        onCancel={toggleModal}
      />
    </>
  );
};
