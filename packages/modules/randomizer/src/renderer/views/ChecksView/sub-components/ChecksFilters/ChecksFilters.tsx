/* @layer renderer-shell @kind component */
import { Badge, Button, Flex, SearchInput, SegmentedControl, Stack } from '@drizztdourden08/tessera/primitives';
import { groupingOptions } from '../../behavior/grouping-options';
import {
  FILTERS_LABEL, FILTERS_TOGGLE_LABEL, FILTER_LABEL, FILTER_OPTIONS, GROUPING_LABEL, KIND_LABEL, KIND_OPTIONS, SEARCH_LABEL, SEARCH_PLACEHOLDER,
  TAGS_LABEL, VIEW_MODE_LABEL, VIEW_MODE_OPTIONS,
} from '../../ChecksView.constants';
import { FacetPanel } from '../FacetPanel';
import type { ChecksFiltersProps } from './ChecksFilters.type';
import { useFilterPanels } from './useFilterPanels';

const ChecksFilters = ({ provider, search, onSearch, prefs }: ChecksFiltersProps) => {
  const panels = useFilterPanels();
  const [filter, setFilter] = prefs.filter;
  const [kind, setKind] = prefs.kind;
  const [grouping, setGrouping] = prefs.grouping;
  const [viewMode, setViewMode] = prefs.viewMode;
  const [facets] = prefs.facets;
  const hasFacets = (provider.facets ?? []).length > 0;
  const activeCount = [filter !== 'all', kind !== 'all', facets.length > 0].filter(Boolean).length;

  return (
    <Stack gap="sm">
      <Flex gap="xs" align="center">
        <SearchInput value={search} onChange={onSearch} placeholder={SEARCH_PLACEHOLDER} aria-label={SEARCH_LABEL} />
        <Badge value={activeCount} hideZero color="warning" label={`${activeCount} filters active`}>
          <Button variant="tertiary" size="sm" active={panels.filters} title={FILTERS_TOGGLE_LABEL} onClick={panels.toggleFilters}>
            {FILTERS_LABEL}
          </Button>
        </Badge>
      </Flex>
      <SegmentedControl aria-label={VIEW_MODE_LABEL} size="sm" value={viewMode} options={VIEW_MODE_OPTIONS} onChange={setViewMode} />
      {panels.filters && (
        <Stack gap="sm">
          <SegmentedControl aria-label={FILTER_LABEL} size="sm" value={filter} options={FILTER_OPTIONS} onChange={setFilter} />
          {provider.kindOf !== undefined && (
            <SegmentedControl aria-label={KIND_LABEL} size="sm" value={kind} options={KIND_OPTIONS} onChange={setKind} />
          )}
          <SegmentedControl aria-label={GROUPING_LABEL} size="sm" value={grouping} options={groupingOptions(provider)} onChange={setGrouping} />
          {hasFacets && (
            <Button variant="tertiary" size="sm" active={facets.length > 0} onClick={panels.toggleTags}>
              {facets.length > 0 ? `${TAGS_LABEL} (${facets.length})` : TAGS_LABEL}
            </Button>
          )}
          {hasFacets && panels.tags && <FacetPanel provider={provider} prefs={prefs} />}
        </Stack>
      )}
    </Stack>
  );
};

export { ChecksFilters };
