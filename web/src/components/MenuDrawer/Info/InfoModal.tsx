import * as React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import './InfoModal.less';

interface InfoModalProps {
  visibility: boolean;
  onCancel(event: React.MouseEvent): void;
}

enum LessonType {
  lecture = 1,
  laboratory = 2,
  practice = 3,
}

export const InfoModal: React.FC<InfoModalProps> = ({ visibility, onCancel }) => {
  const { t } = useTranslation();

  const lessonTypes = Object.values(LessonType)
    .filter((type): type is keyof typeof LessonType => typeof type === 'string')
    .map((type, index) => (
      <p className={`info-lesson-type-${LessonType[type]}`} key={index}>
        {t(`lesson_types.${type}`)}
      </p>
    ));

  return (
    <Modal
      title={t('info.basic_info')}
      visible={visibility}
      onCancel={onCancel}
      footer={null}
      mask={false}
    >
      <div className='info-modal-container'>
        <p className='info-title'>{t('info.colors')}</p>
        <div className='info-modal-description'>{lessonTypes}</div>
        <p className='info-title'>{t('info.icons')}</p>
        <div className='info-modal-description'>
          <p>⭐ {t('info.administrator')}</p>
          <p>📚 {t('info.task')}</p>
        </div>
      </div>
    </Modal>
  );
};
