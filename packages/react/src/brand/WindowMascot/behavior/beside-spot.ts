/* @layer renderer-shell @kind logic */
import { WALKER_GAP, WALKER_HALF } from '../WindowMascot.constants';
import type { WalkerEdges, WalkerSpot } from '../WindowMascot.type';

const besideSpot = (edges: WalkerEdges): WalkerSpot => {
  const before = edges.left - WALKER_GAP - WALKER_HALF;
  if (before >= WALKER_HALF) return { x: before, face: 'right' };
  const after = edges.right + WALKER_GAP + WALKER_HALF;
  if (after <= edges.width - WALKER_HALF) return { x: after, face: 'left' };
  return { x: Math.min(Math.max(before, WALKER_HALF), Math.max(WALKER_HALF, edges.width - WALKER_HALF)), face: 'right' };
};

export { besideSpot };
