import * as React from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LessonService } from '../../../services/lessonService';
import { ScheduleContext } from '../../../contexts/scheduleContext';

export const UpdateScheduleButton: React.FC = () => {
  const { t } = useTranslation();
  const scheduleContext = useContext(ScheduleContext);

  const updateScheduleHandler = (): void => {
    (async function() {
      const lessonService = new LessonService();
      await lessonService.updateSchedule();
      await scheduleContext.refreshSchedule();
    })();
  };

  return <p onClick={updateScheduleHandler}>{t('settings.update_schedule')}</p>;
};
