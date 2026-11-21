/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { PatternLists } from '@drizztdourden08/tessera/composites';
import { KIND_LABELS } from '../sub-components/RemoteAddress/RemoteAddress.constants';

const addressListsOf = (text: (value: Text) => string): PatternLists => ({
  kinds: [{ value: 'host', label: text(KIND_LABELS.host) }, { value: 'ip', label: text(KIND_LABELS.ip) }],
});

export { addressListsOf };
