import { fromUnixTime, getUnixTime } from 'date-fns';

const MILLISECONDS = 1000;

export function toDateFromUnix(unixTime: number): Date {
  return fromUnixTime(unixTime / MILLISECONDS);
}

export function toUnixFromDate(date: Date): string {
  return String(getUnixTime(date) * MILLISECONDS);
}
