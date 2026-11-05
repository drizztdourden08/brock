/* @layer renderer-shell @kind logic */
import type { ChecksPrefs, ChecksViewProps } from '../ChecksView.type';

const seedPrefs = (defaults: ChecksPrefs, initial: ChecksViewProps['initial']): ChecksPrefs => {
  const { showItems, ...rest } = initial ?? {};
  if (showItems === undefined) return { ...defaults, ...rest };
  return { ...defaults, viewMode: showItems ? 'detailed' : 'compact', ...rest };
};

export { seedPrefs };
