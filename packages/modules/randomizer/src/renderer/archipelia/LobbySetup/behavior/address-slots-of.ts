/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { PatternSlotConfigs } from '@drizztdourden08/tessera/composites';
import { HOST_PLACEHOLDER, PORT_PLACEHOLDER, SLOT_LABELS, SLOT_RULES } from '../sub-components/RemoteAddress/RemoteAddress.constants';

const addressSlotsOf = (text: (value: Text) => string): PatternSlotConfigs => ({
  kind: { label: text(SLOT_LABELS.kind) },
  host: { ...SLOT_RULES.host, label: text(SLOT_LABELS.host), placeholder: text(HOST_PLACEHOLDER) },
  a: { ...SLOT_RULES.a, label: text(SLOT_LABELS.a) },
  b: { ...SLOT_RULES.b, label: text(SLOT_LABELS.b) },
  c: { ...SLOT_RULES.c, label: text(SLOT_LABELS.c) },
  d: { ...SLOT_RULES.d, label: text(SLOT_LABELS.d) },
  port: { label: text(SLOT_LABELS.port), placeholder: text(PORT_PLACEHOLDER) },
});

export { addressSlotsOf };
