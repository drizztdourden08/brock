/* @layer renderer-shell @kind types */
import type { ResolvedControl } from '../family/family.type';

interface StickPairGroup {
  readonly label: string;
  readonly basePrefix: string;
  readonly xControl: ResolvedControl;
  readonly yControl: ResolvedControl;
}

interface GroupedAxisControls {
  readonly stickPairs: readonly StickPairGroup[];
  readonly triggers: readonly ResolvedControl[];
}

export type { GroupedAxisControls, StickPairGroup };
