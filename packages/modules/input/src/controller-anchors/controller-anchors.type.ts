/* @layer renderer-lib @kind types */
import type { CONTROLLER_SILHOUETTE_ANCHOR_IDS, CONTROLLER_SILHOUETTE_VARIANTS } from './controller-anchor-ids.constants';

type ControllerSilhouetteVariant = (typeof CONTROLLER_SILHOUETTE_VARIANTS)[number];

type ControllerSilhouetteAnchorId = (typeof CONTROLLER_SILHOUETTE_ANCHOR_IDS)[number];

interface ControllerSilhouetteAnchor {
  readonly x: number;
  readonly y: number;
  readonly r?: number;
}

type ControllerSilhouetteAnchorSet = Readonly<Partial<Record<ControllerSilhouetteAnchorId, ControllerSilhouetteAnchor>>>;

type ControllerSilhouetteAnchors = Readonly<Record<ControllerSilhouetteVariant, ControllerSilhouetteAnchorSet>>;

export type {
  ControllerSilhouetteAnchor, ControllerSilhouetteAnchorId, ControllerSilhouetteAnchors, ControllerSilhouetteAnchorSet,
  ControllerSilhouetteVariant,
};
