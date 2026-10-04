/* @layer electron-main @kind logic */
import { ratioBounds } from '../window/ratio-bounds';
import { resizeEdges } from './resize-edges';
import { resizeSnap } from './resize-snap';
import { sharedEdgeResize } from './shared-edge-resize';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { ResizePlan, SharedResize } from './widget-windows.type';

const planResize = (plan: ResizePlan): SharedResize => {
  const { id, current, proposed, edge, others, rules, min, lock } = plan;
  const locked = id === MAIN_ANCHOR && lock.ratio > 0;
  const fitted = locked ? ratioBounds(current, proposed, edge ?? '', lock) ?? current : proposed;
  const targets = others.map((other) => other.bounds);
  const snapped = rules.snap && !locked ? resizeSnap(fitted, resizeEdges(current, fitted, edge), targets, min) : fitted;
  const partners = lock.ratio > 0 ? others.filter((other) => other.id !== MAIN_ANCHOR) : others;
  return rules.shared ? sharedEdgeResize(current, snapped, partners) : { bounds: snapped, moves: [] };
};

export { planResize };
