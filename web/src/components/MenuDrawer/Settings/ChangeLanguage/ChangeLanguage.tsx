import * as React from 'react';
import { useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ChangeLanguageModal } from './ChangeLanguageModal';

interface ChangeLanguageProps {
  t: TFunction;
}

const languageList = {
  en: 'English',
  ru: 'Russian',
};

export const ChangeLanguage: React.FC<ChangeLanguageProps> = ({ t }) => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const { i18n } = useTranslation();

  const toggleModal = (): void => {
    setVisibility(!visibility);
  };

  async function handleChange(language: string) {
    await i18n.changeLanguage(language);
  }

  const currentLanguage: keyof typeof languageList = i18n.language;

  return (
    <>
      <p onClick={toggleModal}>{t('settings.language')}</p>
      <ChangeLanguageModal
        visible={visibility}
        t={t}
        languageList={languageList}
        currentLanguage={currentLanguage}
        handleChange={handleChange}
        onSubmit={toggleModal}
        onCancel={toggleModal}
      />
    </>
  );
};
