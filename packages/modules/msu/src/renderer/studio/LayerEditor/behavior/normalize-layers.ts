/* @layer renderer-shell @kind logic */
import type { LayerPlayMode, MsuLayer } from '../../../../types';
import { DEFAULT_CROSSFADE_SECONDS } from './layer-ops.constants';

const clampCrossfade = (seconds: number | undefined, max: number): number => {
  if (seconds === undefined || !Number.isFinite(seconds)) return DEFAULT_CROSSFADE_SECONDS;
  return Math.max(0, Math.min(max, seconds));
};

const normalizeMode = (mode: LayerPlayMode, max: number): LayerPlayMode => {
  if (mode.kind === 'loop') {
    const crossfadeSeconds = clampCrossfade(mode.crossfadeSeconds, max);
    const { kind, order } = mode;
    return crossfadeSeconds > DEFAULT_CROSSFADE_SECONDS
      ? { kind, order, crossfadeSeconds }
      : { kind, order };
  }
  if (mode.kind === 'random') {
    const { kind, minDelaySeconds, maxDelaySeconds } = mode;
    return mode.waitForCompletion === true
      ? { kind, minDelaySeconds, maxDelaySeconds, waitForCompletion: true }
      : { kind, minDelaySeconds, maxDelaySeconds };
  }
  return mode;
};

const normalizeLayers = (layers: MsuLayer[], max: number): MsuLayer[] =>
  layers.map((layer) => ({ ...layer, mode: normalizeMode(layer.mode, max) }));

export { normalizeLayers };
