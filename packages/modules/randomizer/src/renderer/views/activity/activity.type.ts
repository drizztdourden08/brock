/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { LogKindDef } from '@drizztdourden08/tessera/composites';
import type { LogRule } from '../../../contract/randomizer-views.type';

type ActivityClass = Pick<LogRule, 'kind' | 'tag'>;

type ActivityKind = Omit<LogKindDef, 'label'> & { label: Text };

export type { ActivityClass, ActivityKind };
