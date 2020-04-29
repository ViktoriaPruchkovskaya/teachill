import * as React from 'react';
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import { PageHeader } from 'antd';
import { UserInfo } from './UserInfo';
import { MenuDrawer } from '../MenuDrawer/MenuDrawer';
import { useTranslation } from 'react-i18next';
import { LanguageButton } from '../Buttons/LanguageButton';
import './Header.less';

export const Header: React.FC = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [lang, setLang] = useState(false);
  const context = useContext(UserContext);
  const { i18n } = useTranslation();

  const toggleDrawer = (): void => {
    setVisibility(!visibility);
  };

  const toggleLang = async (): Promise<void> => {
    setLang(!lang);
    lang ? await i18n.changeLanguage('en') : await i18n.changeLanguage('ru');
  };

  const content = context.username ? (
    <div className='header-container'>
      <LanguageButton onClick={toggleLang} />
      <UserInfo onClick={toggleDrawer} context={context} />
    </div>
  ) : null;

  return (
    <div className='header'>
      <PageHeader title='Teachill' extra={content} />
      <MenuDrawer onClick={toggleDrawer} context={context} visibility={visibility} />
    </div>
  );
};
