/* @layer renderer-shell @kind types */
import type { HeroBackdrop } from '@drizztdourden08/tessera/composites';

type PaintedBackdrop = Exclude<HeroBackdrop, { kind: 'node' }>;

interface HubBackdropProps {
  backdrop: PaintedBackdrop;
}

export type { HubBackdropProps, PaintedBackdrop };
