/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { initialAssumed } from '../../tracker/feed/initial-assumed';
import { useTrackerFeed } from '../../tracker/hooks/behavior/useTrackerFeed';
import { useTrackerReading } from '../../tracker/hooks/behavior/useTrackerReading';
import { useTrackerMarks } from '../../tracker/marks/behavior/useTrackerMarks';
import { filterRows } from './behavior/filter-rows';
import { groupRows } from './behavior/group-rows';
import { rowsOf } from './behavior/rows-of';
import { useChecksPrefs } from './behavior/useChecksPrefs';
import { NO_READING_MESSAGE, NO_TRACKER_MESSAGE } from './ChecksView.constants';
import type { ChecksViewProps } from './ChecksView.type';
import { ChecksGroups } from './sub-components/ChecksGroups';
import { ChecksHeader } from './sub-components/ChecksHeader';

const ChecksView = (props: ChecksViewProps) => {
  const provider = useRandomizerGame()?.tracker;
  const prefs = useChecksPrefs(props);
  const [search, setSearch] = useState('');
  const feed = useTrackerFeed();
  const [assumed] = prefs.assumed;
  const reading = useTrackerReading(assumed ?? undefined);
  const { marks, toggle } = useTrackerMarks();
  if (provider === undefined) return <EmptyState message={NO_TRACKER_MESSAGE} />;
  if (reading === null || feed === null) return <EmptyState message={NO_READING_MESSAGE} />;
  const [grouping] = prefs.grouping;
  const [status] = prefs.filter;
  const [kind] = prefs.kind;
  const [facets] = prefs.facets;
  const [facetMode] = prefs.facetMode;
  const [viewMode] = prefs.viewMode;
  const [expanded, setExpanded] = prefs.expanded;
  const rows = rowsOf({ provider, reading, feed, marks, grouping });
  const shown = filterRows(rows, { status, kind, facets, facetMode, search });

  return (
    <Stack gap="md">
      <ChecksHeader
        provider={provider}
        counts={reading.counts}
        search={search}
        onSearch={setSearch}
        prefs={prefs}
        active={assumed ?? [...initialAssumed(provider)]}
      />
      <ChecksGroups root={groupRows(shown)} viewMode={viewMode} expanded={expanded} onExpanded={setExpanded} onToggle={toggle} />
    </Stack>
  );
};

export { ChecksView };
