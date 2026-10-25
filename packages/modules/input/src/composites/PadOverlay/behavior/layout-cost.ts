/* @layer renderer-components @kind logic */
import type { OverlayLayout } from '../PadOverlay.type';

const layoutCost = (layout: OverlayLayout): number => layout.labels.reduce((sum, label) => sum + label.cost, 0);

export { layoutCost };
