/* @layer renderer-lib @kind types */
import type { ControllerSilhouetteVariant } from '../composites/ControllerSilhouette';
import type { ControllerSlotId } from '../pad/controller-slot.type';
import type { InputIconSource } from '@drizztdourden08/tessera/primitives';
import type { LabelSide, Nudge, OverlayPartKind } from '../composites/PadOverlay';
import type { LayoutFamily } from '../controller-families/controller-families.type';

interface OverlaySlot {
  anchor: ControllerSlotId;
  kind: OverlayPartKind;
  glyph: string;
  label: string;
  side?: LabelSide;
  nudge?: Nudge;
  scale?: number;
}


interface FamilyOverlay {
  variant: ControllerSilhouetteVariant;
  slots: readonly OverlaySlot[];
}

type VidPid = `${string}:${string}`;

interface ControllerOverride {
  family?: LayoutFamily;
  variant?: ControllerSilhouetteVariant;
  slots?: Partial<Record<ControllerSlotId, Partial<OverlaySlot> | null>>;
}

type ControllerOverrides = Readonly<Record<VidPid, ControllerOverride>>;

type PositionIcons = Readonly<Record<string, InputIconSource>>;

export type {
  ControllerOverride, ControllerOverrides, FamilyOverlay, OverlaySlot, PositionIcons,
  VidPid,
};
