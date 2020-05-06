import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Select } from 'antd';
import './ChangeLanguage.less';

interface ChangeLanguageModalProps {
  visible: boolean;
  languageList: {};
  currentLanguage: string;
  handleChange(language: string): void;
  onSubmit(event: React.MouseEvent): void;
  onCancel(event: React.MouseEvent): void;
}

export const ChangeLanguageModal: React.FC<ChangeLanguageModalProps> = ({
  visible,
  languageList,
  currentLanguage,
  handleChange,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { Option } = Select;

  const options = Object.entries(languageList).map((language, index) => (
    <Option value={language[0]} key={index}>
      {language[1]}
    </Option>
  ));

  return (
    <Modal
      visible={visible}
      title={t('forms.language')}
      onCancel={onCancel}
      footer={
        <Button type='primary' onClick={onSubmit}>
          OK
        </Button>
      }
      className='modal-container'
    >
      <div>
        <span className='current-language-container'>{t('forms.language_text')}:</span>
        <Select
          defaultValue={currentLanguage}
          optionFilterProp='children'
          onChange={handleChange}
          className='change-language-selector '
        >
          {options}
        </Select>
      </div>
    </Modal>
  );
};
