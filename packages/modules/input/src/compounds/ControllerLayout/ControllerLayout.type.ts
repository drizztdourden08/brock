/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { CONTROLLER_LAYOUT_VARIANTS, CONTROLLER_SLOT_IDS, CONTROLLER_STRINGS } from './ControllerLayout.constants';

type ControllerSlotId = (typeof CONTROLLER_SLOT_IDS)[number];

type ControllerLayoutVariant = (typeof CONTROLLER_LAYOUT_VARIANTS)[number];

interface ControllerSlotState {
  pressed?: boolean;
  value?: number;
  x?: number;
  y?: number;
  label?: string;
  glyph?: ReactNode;
}

interface ControllerExtra {
  id: string;
  label: string;
  glyph?: ReactNode;
  pressed?: boolean;
  value?: number;
}

type ControllerSlots = Partial<Record<ControllerSlotId, ControllerSlotState>>;

interface ControllerLayoutProps {
  variant: ControllerLayoutVariant;
  slots: ControllerSlots;
  extras?: readonly ControllerExtra[];
  label?: string;
  className?: string;
}

type ControllerShape =
  | { readonly kind: 'circle'; readonly cx: number; readonly cy: number; readonly r: number }
  | { readonly kind: 'rect'; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly r: number };

type ControllerControlKind = 'button' | 'fill' | 'stick';

type ControllerTagAt = 'on' | 'below';

interface ControllerPlace {
  readonly id: ControllerSlotId;
  readonly kind: ControllerControlKind;
  readonly shape: ControllerShape;
  readonly tag: { readonly x: number; readonly y: number; readonly at: ControllerTagAt };
}

interface ControllerGeometry {
  readonly body: string;
  readonly decor: readonly ControllerShape[];
  readonly places: readonly ControllerPlace[];
}

interface ControllerRow {
  id: string;
  label: string;
  glyph?: ReactNode;
  active: boolean;
  amount?: number;
}

type ControllerStrings = typeof CONTROLLER_STRINGS;

interface ControllerAnalog {
  pressed?: boolean;
  value?: number;
}

interface ControllerControlProps {
  place: ControllerPlace;
  state: ControllerSlotState | undefined;
}

interface ControllerStickProps extends ControllerControlProps {
  click: ControllerSlotState | undefined;
}

interface ControllerTagProps {
  place: ControllerPlace;
  state: ControllerSlotState | undefined;
  active: boolean;
}

interface ControllerShapeProps {
  shape: ControllerShape;
  className: string;
  active?: boolean;
}

interface ControllerLayoutBodyProps {
  geometry: ControllerGeometry;
  slots: ControllerSlots;
}

interface ControllerRowsProps {
  rows: readonly ControllerRow[];
  label: string;
}

interface ControllerHeldProps {
  lines: readonly string[];
  label: string;
  empty: string;
}

export type {
  ControllerAnalog, ControllerControlKind, ControllerControlProps, ControllerExtra, ControllerGeometry, ControllerHeldProps,
  ControllerLayoutProps, ControllerLayoutVariant, ControllerPlace, ControllerRow, ControllerRowsProps, ControllerShape,
  ControllerShapeProps, ControllerLayoutBodyProps, ControllerSlotId, ControllerSlotState, ControllerSlots,
  ControllerStickProps, ControllerStrings, ControllerTagAt, ControllerTagProps,
};
