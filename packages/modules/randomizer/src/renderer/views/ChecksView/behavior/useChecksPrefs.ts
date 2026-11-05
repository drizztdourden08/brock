/* @layer renderer-shell @kind hook */
import { useWidgetPref } from '@drizztdourden08/brock-react';
import { DEFAULT_CHECKS_PREFS } from '../ChecksView.constants';
import type { ChecksPrefState, ChecksViewProps } from '../ChecksView.type';
import { seedPrefs } from './seed-prefs';

const useChecksPrefs = ({ prefKey = null, initial }: ChecksViewProps): ChecksPrefState => {
  const start = seedPrefs(DEFAULT_CHECKS_PREFS, initial);
  return {
    grouping: useWidgetPref(prefKey, 'grouping', start.grouping),
    filter: useWidgetPref(prefKey, 'filter', start.filter),
    kind: useWidgetPref(prefKey, 'kind', start.kind),
    facets: useWidgetPref(prefKey, 'facets', start.facets),
    facetMode: useWidgetPref(prefKey, 'facetMode', start.facetMode),
    assumed: useWidgetPref(prefKey, 'assumed', start.assumed),
    viewMode: useWidgetPref(prefKey, 'viewMode', start.viewMode),
    expanded: useWidgetPref(prefKey, 'expanded', start.expanded),
  };
};

export { useChecksPrefs };
