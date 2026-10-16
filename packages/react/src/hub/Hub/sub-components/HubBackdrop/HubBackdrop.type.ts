/* @layer renderer-shell @kind types */
import type { Backdrop } from '@drizztdourden08/tessera/primitives';

type PaintedBackdrop = Exclude<Backdrop, { kind: 'node' }>;

interface HubBackdropProps {
  backdrop: PaintedBackdrop;
}

export type { HubBackdropProps, PaintedBackdrop };
