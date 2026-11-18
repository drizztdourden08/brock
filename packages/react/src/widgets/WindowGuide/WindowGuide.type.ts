/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WindowGuideHint } from '@drizztdourden08/tessera/composites';

type GuideHintDef = Omit<WindowGuideHint, 'label'> & { label: Text };

export type { GuideHintDef };
