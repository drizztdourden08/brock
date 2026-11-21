/* @layer renderer-shell @kind component */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { useT } from '@drizztdourden08/brock-react';
import { ScrollArea, Text } from '@drizztdourden08/tessera/primitives';
import type { MusicDebugCounter } from '../../../music-debug';
import { useStableOrder } from '../behavior/useStableOrder';
import { MusicRow } from './MusicRow';
import './CounterTable.css';

const splitOf = (row: MusicDebugCounter, t: I18n['t']): string => {
  if (row.skipped > 0 || row.key.startsWith('roll:')) {
    const percent = row.raised > 0 ? Math.round((row.pack / row.raised) * 100) : 0;
    return t('msu:debugger.split.played', { pack: row.pack, raised: row.raised, percent });
  }
  if (row.pack > 0 && row.chip === 0) return t('msu:debugger.split.msu', { raised: row.raised });
  if (row.chip > 0 && row.pack === 0) return t('msu:debugger.split.chip', { raised: row.raised });
  return t('msu:debugger.split.both', { pack: row.pack, chip: row.chip });
};

const CounterTable = (props: { counters: MusicDebugCounter[] }) => {
  const t = useT();
  const rows = useStableOrder(props.counters);

  return (
    <ScrollArea className="counter-table" fade={false}>
      {rows.length === 0 && (
        <MusicRow className="counter-table__row" empty>
          <Text className="counter-table__label">{t('msu:debugger.noCounts')}</Text>
        </MusicRow>
      )}
      {rows.map((row) => (
        <MusicRow key={row.key} className="counter-table__row">
          <Text className="counter-table__label" title={`${row.channel}, ${row.label}`}>{`${row.channel}, ${row.label}`}</Text>
          <Text className="counter-table__value">{splitOf(row, t)}</Text>
        </MusicRow>
      ))}
    </ScrollArea>
  );
};

export { CounterTable };
