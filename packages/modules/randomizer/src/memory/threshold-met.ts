/* @layer core @kind logic */
const thresholdMet = (val: number, compare: 'eq' | 'gte' | 'anyOf', value: number | readonly number[]): boolean => {
  if (typeof value !== 'number') return compare === 'anyOf' && value.includes(val);
  if (compare === 'gte') return val >= value;
  if (compare === 'eq') return val === value;
  return false;
};

export { thresholdMet };
