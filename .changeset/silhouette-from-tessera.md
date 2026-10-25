---
'@drizztdourden08/brock-input': patch
'@drizztdourden08/brock-build': patch
---

The `ControllerSilhouette` component comes from Tessera again, and the module no longer carries a copy of it. Brock keeps the anchors: `CONTROLLER_SILHOUETTE_ANCHORS`, the anchor ids, the variants and the anchor types stay exported from `@drizztdourden08/brock-input/renderer`, with the same positions, and `PadOverlay` and the pad page read them. `ControllerSilhouette`, `ControllerSilhouetteProps`, `CONTROLLER_SILHOUETTE_PATHS` and `CONTROLLER_SILHOUETTE_VIEW_BOX` are no longer exported from the module. Upgrading: import them from `@drizztdourden08/tessera/composites`. The migration `silhouette-from-tessera` rewrites those imports.
