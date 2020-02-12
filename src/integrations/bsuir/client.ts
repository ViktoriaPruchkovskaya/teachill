import fetch from 'node-fetch';

export interface GroupScheduleResponse {
  todayDate: string;
  dateStart: string;
  dateEnd: string;
  currentWeekNumber: number;
  schedules: WeekDayScheduleResponse[];
}

export interface WeekDayScheduleResponse {
  weekDay: string;
  schedule: ScheduleResponse[];
}
interface ScheduleResponse {
  weekNumber: number[];
  numSubgroup: number;
  auditory: string[];
  startLessonTime: string;
  endLessonTime: string;
  subject: string;
  lessonType: string;
  employee: EmployeeResponse[];
}

interface EmployeeResponse {
  fio: string;
}

export class BSUIRClient {
  public async getGroupSchedule(groupId: number): Promise<GroupScheduleResponse> {
    try {
      const response = await fetch(
        `https://journal.bsuir.by/api/v1/studentGroup/schedule?studentGroup=${groupId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }
}
