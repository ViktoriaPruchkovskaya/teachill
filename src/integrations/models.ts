export interface Lesson {
  name: string;
  typeId: number;
  location: string;
  startTime: string;
  duration: number;
  teacher: Teacher[];
}

interface Teacher {
  fio: string;
}
