/* @layer core @kind logic */
import { isRecord } from './is-record';

const sizeOfField = (placement: unknown, field: string): number => {
  if (!isRecord(placement)) return 0;
  const value = placement[field];
  if (Array.isArray(value)) return value.length;
  return isRecord(value) ? Object.keys(value).length : 0;
};

export { sizeOfField };
