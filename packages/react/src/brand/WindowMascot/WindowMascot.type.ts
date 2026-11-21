/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { AnimatedMascotBrand, MascotFacing } from '@drizztdourden08/tessera/brand';

interface WalkerSetup {
  brand: AnimatedMascotBrand;
  hint: Text;
}

interface WalkerRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface WalkerSpot {
  x: number;
  face: MascotFacing;
}

interface WalkerEdges {
  left: number;
  right: number;
  width: number;
}

export type { WalkerEdges, WalkerRect, WalkerSetup, WalkerSpot };
