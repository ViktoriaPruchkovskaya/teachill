import * as React from 'react';
import { currentLanguage } from '../../utils/language';
import './LanguageButton.less';

interface LanguageButtonProps {
  onClick(event: React.MouseEvent): void;
}

export const LanguageButton: React.FC<LanguageButtonProps> = ({ onClick }) => {
  return (
    <span className='button' onClick={onClick}>
      {currentLanguage()}
    </span>
  );
};
