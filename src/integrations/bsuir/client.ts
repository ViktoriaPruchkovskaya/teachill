import fetch from 'node-fetch';

export interface GroupScheduleResponse {
  todayDate: string;
  dateStart: string;
  dateEnd: string;
  currentWeekNumber: number;
  studentGroup: GroupResponse;
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

interface GroupResponse {
  name: string;
}

export class BSUIRClient {
  private API_HOST = 'https://journal.bsuir.by/';

  public async getGroupSchedule(groupId: number): Promise<GroupScheduleResponse> {
    try {
      const response = await fetch(
        new URL(`api/v1/studentGroup/schedule?studentGroup=${groupId}`, this.API_HOST),
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
