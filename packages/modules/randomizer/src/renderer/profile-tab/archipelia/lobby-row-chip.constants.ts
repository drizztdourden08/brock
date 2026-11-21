/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { MembershipState } from '../../archipelia/membership/membership.type';
import type { RowChipDef } from './lobby-row-chip.type';

const ROW_CHIPS: Readonly<Record<MembershipState['kind'], RowChipDef | null>> = {
  pending: { label: msg('randomizer:lobby.chip.waiting'), tone: 'warning' },
  failed: { label: msg('randomizer:lobby.chip.waiting'), tone: 'warning' },
  approved: { label: msg('randomizer:lobby.chip.approved'), tone: 'success' },
  refused: { label: msg('randomizer:lobby.chip.refused'), tone: 'danger' },
  gone: { label: msg('randomizer:lobby.chip.gone'), tone: 'danger' },
  started: null,
};

export { ROW_CHIPS };
