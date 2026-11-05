/* @layer renderer-shell @kind component */
import { ScrollArea, Text } from '@drizztdourden08/tessera/primitives';
import type { MusicDebugCounter } from '../../../music-debug';
import { useStableOrder } from '../behavior/useStableOrder';
import { MusicRow } from './MusicRow';
import './CounterTable.css';

const splitOf = (row: MusicDebugCounter): string => {
  if (row.skipped > 0 || row.key.startsWith('roll:')) {
    const percent = row.raised > 0 ? Math.round((row.pack / row.raised) * 100) : 0;
    return `${row.pack}/${row.raised} played (${percent}%)`;
  }
  if (row.pack > 0 && row.chip === 0) return `${row.raised}x MSU`;
  if (row.chip > 0 && row.pack === 0) return `${row.raised}x chip`;
  return `${row.pack}x MSU, ${row.chip}x chip`;
};

const CounterTable = (props: { counters: MusicDebugCounter[] }) => {
  const rows = useStableOrder(props.counters);

  return (
    <ScrollArea className="counter-table" fade={false}>
      {rows.length === 0 && (
        <MusicRow className="counter-table__row" empty>
          <Text className="counter-table__label">Nothing counted yet.</Text>
        </MusicRow>
      )}
      {rows.map((row) => (
        <MusicRow key={row.key} className="counter-table__row">
          <Text className="counter-table__label" title={`${row.channel}, ${row.label}`}>{`${row.channel}, ${row.label}`}</Text>
          <Text className="counter-table__value">{splitOf(row)}</Text>
        </MusicRow>
      ))}
    </ScrollArea>
  );
};

export { CounterTable };
