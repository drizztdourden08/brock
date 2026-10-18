/* @layer renderer-shell @kind logic */
import type { WalkerReading } from '../dom/read-walker.type';

const mascotApart = ({ actor, palette }: WalkerReading): boolean =>
  actor !== null && palette !== null && ((actor.left + actor.right) / 2 < palette.left || (actor.left + actor.right) / 2 > palette.right);

export { mascotApart };
