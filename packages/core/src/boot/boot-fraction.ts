/* @layer core @kind logic */
import type { BootProgress } from './boot-task.type';

const bootFraction = ({ done, total }: Pick<BootProgress, 'done' | 'total'>): number =>
  (total > 0 ? Math.min(1, Math.max(0, done / total)) : 1);

export { bootFraction };
