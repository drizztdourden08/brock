/* @layer core @kind types */
import type { ResolvedControl } from '../../family/family.type';
import type { InputBinding, VerbPosition } from '../bindings.type';

interface VerbDef {
  id: string;
  label: string;
  position: VerbPosition;
  keyboard?: InputBinding;
  claimsSlot?: boolean;
}

interface VerbSource {
  stored?: Readonly<Record<string, InputBinding>>;
  controls?: readonly ResolvedControl[];
  keyboard?: boolean;
}

export type { VerbDef, VerbSource };
