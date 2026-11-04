/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { SegmentedControl, StatRow } from '@drizztdourden08/tessera/primitives';
import { ALL_FILTER } from '../GameInfoWidget.constants';
import { Spoiler } from './Spoiler';
import type { ListBlockProps } from './ListBlock.type';

const ListBlock = ({ block, prefs }: ListBlockProps) => {
  const [filter, setFilter] = useState(ALL_FILTER);
  const options = [ALL_FILTER, ...(block.filters ?? [])].map((value) => ({ value, label: value }));
  const items = block.items.filter((item) => filter === ALL_FILTER || item.group === filter);
  return (
    <>
      {block.filters && block.filters.length > 0 && (
        <SegmentedControl value={filter} options={options} onChange={setFilter} size="sm" />
      )}
      {items.map((item, index) => (
        <Spoiler key={index} hidden={Boolean(item.spoiler) && prefs.hideSpoilers}>
          <StatRow label={item.label} value={item.count ?? ''} />
        </Spoiler>
      ))}
    </>
  );
};

export { ListBlock };
