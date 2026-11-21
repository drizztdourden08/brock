/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { Badge, Button, Flex, SearchInput, SegmentedControl, Stack } from '@drizztdourden08/tessera/primitives';
import { groupingOptions } from '../../behavior/grouping-options';
import { segmentOptionsOf } from '../../behavior/segment-options-of';
import {
  FILTERS_LABEL, FILTERS_TOGGLE_LABEL, FILTER_LABEL, FILTER_OPTIONS, GROUPING_LABEL, KIND_LABEL, KIND_OPTIONS, SEARCH_LABEL, SEARCH_PLACEHOLDER,
  TAGS_LABEL, VIEW_MODE_LABEL, VIEW_MODE_OPTIONS,
} from '../../ChecksView.constants';
import { FacetPanel } from '../FacetPanel';
import type { ChecksFiltersProps } from './ChecksFilters.type';
import { useFilterPanels } from '../../behavior/useFilterPanels';

const ChecksFilters = ({ provider, search, onSearch, prefs }: ChecksFiltersProps) => {
  const text = useText();
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
        <SearchInput value={search} onChange={onSearch} placeholder={text(SEARCH_PLACEHOLDER)} aria-label={text(SEARCH_LABEL)} />
        <Badge value={activeCount} hideZero color="warning" label={text(msg('randomizer:checks.filtersActive', { count: activeCount }))}>
          <Button variant="tertiary" size="sm" active={panels.filters} title={text(FILTERS_TOGGLE_LABEL)} onClick={panels.toggleFilters}>
            {text(FILTERS_LABEL)}
          </Button>
        </Badge>
      </Flex>
      <SegmentedControl aria-label={text(VIEW_MODE_LABEL)} size="sm" value={viewMode} options={segmentOptionsOf(VIEW_MODE_OPTIONS, text)} onChange={setViewMode} />
      {panels.filters && (
        <Stack gap="sm">
          <SegmentedControl aria-label={text(FILTER_LABEL)} size="sm" value={filter} options={segmentOptionsOf(FILTER_OPTIONS, text)} onChange={setFilter} />
          {provider.kindOf !== undefined && (
            <SegmentedControl aria-label={text(KIND_LABEL)} size="sm" value={kind} options={segmentOptionsOf(KIND_OPTIONS, text)} onChange={setKind} />
          )}
          <SegmentedControl aria-label={text(GROUPING_LABEL)} size="sm" value={grouping} options={groupingOptions(provider, text)} onChange={setGrouping} />
          {hasFacets && (
            <Button variant="tertiary" size="sm" active={facets.length > 0} onClick={panels.toggleTags}>
              {text(facets.length > 0 ? msg('randomizer:checks.tagsCount', { count: facets.length }) : TAGS_LABEL)}
            </Button>
          )}
          {hasFacets && panels.tags && <FacetPanel provider={provider} prefs={prefs} />}
        </Stack>
      )}
    </Stack>
  );
};

export { ChecksFilters };
