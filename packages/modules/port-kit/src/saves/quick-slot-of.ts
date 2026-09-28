/* @layer core @kind logic */
import { QUICK_FILE_PATTERN } from './save-slot.constants';

const quickSlotOf = (fileName: string): number | null => {
  const digits = QUICK_FILE_PATTERN.exec(fileName)?.[1];
  return digits === undefined ? null : Number(digits);
};

export { quickSlotOf };
