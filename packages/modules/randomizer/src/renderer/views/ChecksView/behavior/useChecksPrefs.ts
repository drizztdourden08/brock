/* @layer renderer-shell @kind hook */
import { useWidgetPref } from '@drizztdourden08/brock-react';
import { DEFAULT_CHECKS_PREFS } from '../ChecksView.constants';
import type { ChecksPrefState, ChecksViewProps } from '../ChecksView.type';

const useChecksPrefs = ({ prefKey = null, initial }: ChecksViewProps): ChecksPrefState => {
  const start = { ...DEFAULT_CHECKS_PREFS, ...initial };
  return {
    grouping: useWidgetPref(prefKey, 'grouping', start.grouping),
    filter: useWidgetPref(prefKey, 'filter', start.filter),
    assumed: useWidgetPref(prefKey, 'assumed', start.assumed),
    showItems: useWidgetPref(prefKey, 'showItems', start.showItems),
    expanded: useWidgetPref(prefKey, 'expanded', start.expanded),
  };
};

export { useChecksPrefs };
