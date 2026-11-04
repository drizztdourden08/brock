/* @layer core @kind logic */
import { TRACKER_SCHEMA } from '../tracker.constants';
import type { TrackerFile } from '../types/tracker-file.type';

const isTrackerFile = (value: unknown): value is TrackerFile => {
  if (typeof value !== 'object' || value === null) return false;
  const { schema, marks } = value as Partial<Record<keyof TrackerFile, unknown>>;
  return schema === TRACKER_SCHEMA && Array.isArray(marks) && marks.every((mark) => typeof mark === 'string');
};

export { isTrackerFile };
