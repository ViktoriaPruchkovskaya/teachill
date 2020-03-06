import { fromUnixTime } from 'date-fns';

const MILLISECONDS = 1000;

export function toDateFromUnix(unixTime: number): Date {
  return fromUnixTime(unixTime / MILLISECONDS);
}
