/* @layer core @kind logic */
import { isTrackerFile } from './is-tracker-file';

const marksFromRaw = (raw: unknown): string[] => (isTrackerFile(raw) ? [...raw.marks] : []);

export { marksFromRaw };
