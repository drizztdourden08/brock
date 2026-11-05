/* @layer renderer-shell @kind logic */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';
import type { LogRule } from '../../../contract/randomizer-views.type';
import { ACTIVITY_KINDS, GAME_KIND_TONE } from './activity-kinds.constants';

const activityKindsOf = (gameRules: readonly LogRule[], names: Readonly<Record<string, string>> = {}): LogKindDef[] => {
  const known = new Set(ACTIVITY_KINDS.map((kind) => kind.id));
  const extra = [...new Set(gameRules.map((rule) => rule.kind))]
    .filter((id) => !known.has(id))
    .map((id): LogKindDef => ({ id, label: id, tone: GAME_KIND_TONE, toneMessage: true }));
  return [...ACTIVITY_KINDS, ...extra].map((kind) => ({ ...kind, label: names[kind.id] ?? kind.label }));
};

export { activityKindsOf };
