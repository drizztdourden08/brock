/* @layer renderer-shell @kind component */
import { FilterBar } from '@drizztdourden08/tessera/composites';
import { SegmentedControl, Stack, StackedBar, Toggle } from '@drizztdourden08/tessera/primitives';
import { countSegments } from '../../behavior/count-segments';
import { groupingOptions } from '../../behavior/grouping-options';
import {
  BAR_LABEL, FILTER_LABEL, FILTER_OPTIONS, GROUPING_LABEL, SEARCH_LABEL, SHOW_ITEMS_LABEL,
} from '../../ChecksView.constants';
import { AssumptionToggles } from '../AssumptionToggles';
import type { ChecksHeaderProps } from './ChecksHeader.type';

const ChecksHeader = ({ provider, counts, search, onSearch, prefs, active }: ChecksHeaderProps) => {
  const [grouping, setGrouping] = prefs.grouping;
  const [filter, setFilter] = prefs.filter;
  const [showItems, setShowItems] = prefs.showItems;
  const [, setAssumed] = prefs.assumed;

  return (
    <Stack gap="sm">
      <StackedBar segments={countSegments(counts)} total={counts.total} label={BAR_LABEL} size="sm" />
      <FilterBar
        search={search}
        onSearchChange={onSearch}
        searchLabel={SEARCH_LABEL}
        extra={<SegmentedControl aria-label={FILTER_LABEL} size="sm" value={filter} options={FILTER_OPTIONS} onChange={setFilter} />}
      />
      <SegmentedControl aria-label={GROUPING_LABEL} size="sm" value={grouping} options={groupingOptions(provider)} onChange={setGrouping} />
      <AssumptionToggles assumptions={provider.assumptions ?? []} active={active} onChange={setAssumed} />
      <Toggle label={SHOW_ITEMS_LABEL} checked={showItems} onChange={setShowItems} />
    </Stack>
  );
};

export { ChecksHeader };
