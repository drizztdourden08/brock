/* @layer core @kind logic */
import { countsOf } from './counts-of';

const commonestFiller = (filler: readonly string[]): string => {
  const counts = Object.entries(countsOf(filler)).sort(([a, left], [b, right]) => right - left || a.localeCompare(b));
  const [top] = counts;
  if (top === undefined) throw new Error('pool carries no filler');
  return top[0];
};

export { commonestFiller };
