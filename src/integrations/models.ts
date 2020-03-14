export interface GroupSchedule {
  name: string;
  lessons: Lesson[];
}

export interface Lesson {
  name: string;
  typeId: number;
  subgroup: number | null;
  location: string;
  startTime: string;
  duration: number;
  teacher: Teacher[];
}

interface Teacher {
  fio: string;
}
