import { add, format } from 'date-fns';

export function addDuration(date: Date, duration: number): string {
  const newDate = add(date, { minutes: duration });
  return getTime(newDate);
}

export function getTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function getDate(date: Date): string {
  return format(date, 'dd.MM');
}
