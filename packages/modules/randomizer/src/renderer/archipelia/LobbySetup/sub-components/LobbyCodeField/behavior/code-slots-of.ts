/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { PatternSlotConfigs } from '@drizztdourden08/tessera/composites';
import { CODE_SLOT_LABELS, CODE_SLOT_RULES } from '../LobbyCodeField.constants';

const codeSlotsOf = (text: (value: Text) => string): PatternSlotConfigs => ({
  left: { label: text(CODE_SLOT_LABELS.left), ...CODE_SLOT_RULES },
  right: { label: text(CODE_SLOT_LABELS.right), ...CODE_SLOT_RULES },
});

export { codeSlotsOf };
