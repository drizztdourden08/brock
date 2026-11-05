/* @layer renderer-shell @kind logic */
import type { ChecksPrefs, ChecksViewProps } from '../ChecksView.type';

const seedPrefs = (defaults: ChecksPrefs, initial: ChecksViewProps['initial']): ChecksPrefs => {
  const { showItems, ...rest } = initial ?? {};
  const mode = showItems === undefined ? defaults.viewMode : (showItems ? 'detailed' : 'compact');
  return { ...defaults, viewMode: mode, ...rest };
};

export { seedPrefs };
