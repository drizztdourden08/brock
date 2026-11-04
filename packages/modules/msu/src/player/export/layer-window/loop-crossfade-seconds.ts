/* @layer core @kind logic */
import type { MsuLayer } from '../../../types';

const loopCrossfadeSeconds = (layer: MsuLayer): number =>
  (layer.mode.kind === 'loop' ? Math.max(0, layer.mode.crossfadeSeconds ?? 0) : 0);

export { loopCrossfadeSeconds };
