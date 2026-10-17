/* @layer renderer-shell @kind types */
import type { AnimatedMascotBrand, MascotFacing } from '@drizztdourden08/tessera/brand';

interface WalkerSetup {
  brand: AnimatedMascotBrand;
  hint: string;
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
