/* @layer core @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

type GateResult = { ok: true } | { ok: false; reason: string; detail: Text };

export type { GateResult };
