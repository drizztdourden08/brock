/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { ArchipeliaMembership } from '../../archipelia/membership/membership.type';
import { LOBBY_FACT_LABELS as LABELS } from './lobby-facts.constants';

const buildLobbyFacts = (membership: ArchipeliaMembership, slotName: string, text: (value: Text) => string): FactsPanelFact[] => [
  { label: text(LABELS.server), value: membership.server, mono: true },
  { label: text(LABELS.lobby), value: membership.lobbyName },
  ...(membership.lobby.code === undefined ? [] : [{ label: text(LABELS.code), value: membership.lobby.code, mono: true, copyable: true }]),
  { label: text(LABELS.archipelago), value: membership.ap, mono: true },
  { label: text(LABELS.slot), value: slotName },
];

export { buildLobbyFacts };
