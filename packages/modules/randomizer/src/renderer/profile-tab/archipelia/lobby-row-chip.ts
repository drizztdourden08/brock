/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { ArchipeliaMembership } from '../../archipelia/membership/membership.type';
import { ROW_CHIPS } from './lobby-row-chip.constants';

const lobbyRowChip = (
  membership: ArchipeliaMembership | undefined,
  text: (value: Text) => string,
): { label: string; tone: StatusTone } | null => {
  const chip = membership === undefined ? null : ROW_CHIPS[membership.state.kind];
  return chip === null ? null : { label: text(chip.label), tone: chip.tone };
};

export { lobbyRowChip };
