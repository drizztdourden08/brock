/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { LogKindDef } from '@drizztdourden08/tessera/composites';
import type { LogRule } from '../../../contract/randomizer-views.type';
import { ACTIVITY_KINDS, GAME_KIND_TONE } from './activity-kinds.constants';
import type { ActivityKind } from './activity.type';

const activityKindsOf = (gameRules: readonly LogRule[], text: (value: Text) => string, names: Readonly<Record<string, string>> = {}): LogKindDef[] => {
  const known = new Set(ACTIVITY_KINDS.map((kind) => kind.id));
  const extra = [...new Set(gameRules.map((rule) => rule.kind))]
    .filter((id) => !known.has(id))
    .map((id): ActivityKind => ({ id, label: id, tone: GAME_KIND_TONE, toneMessage: true }));
  return [...ACTIVITY_KINDS, ...extra].map((kind) => ({ ...kind, label: names[kind.id] ?? text(kind.label) }));
};

export { activityKindsOf };
