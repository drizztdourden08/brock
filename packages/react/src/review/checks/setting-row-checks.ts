/* @layer renderer-shell @kind logic */
import type { ReviewOutcome, SettingRowsSnapshot } from '../review.type';
import { outcome } from './outcome';

const settingRowChecks = (id: string, snapshot: SettingRowsSnapshot): ReviewOutcome[] => {
  const { total, empty } = snapshot;
  if (total === 0) return [];
  return [
    outcome(
      `${id}-setting-controls`,
      empty.length === 0,
      `all ${total} setting rows draw a control`,
      `setting rows with no control: ${empty.join(', ')}`,
    ),
  ];
};

export { settingRowChecks };
