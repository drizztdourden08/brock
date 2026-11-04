/* @layer renderer-shell @kind component */
import { StatRow } from '@drizztdourden08/tessera/primitives';
import type { RowsBlock as RowsBlockData } from '../../../provider/block.type';
import type { GameInfoPrefsValue } from '../GameInfoWidget.type';
import { IdValue } from './IdValue';
import { Spoiler } from './Spoiler';

interface RowsBlockProps {
  block: RowsBlockData;
  prefs: GameInfoPrefsValue;
}

const RowsBlock = ({ block, prefs }: RowsBlockProps) => (
  <>
    {block.rows.map((row, index) => (
      <Spoiler key={index} hidden={Boolean(row.spoiler) && prefs.hideSpoilers}>
        <StatRow label={row.label} value={<IdValue value={row.value} hexIds={prefs.hexIds} />} mono={row.mono} />
      </Spoiler>
    ))}
  </>
);

export { RowsBlock };
