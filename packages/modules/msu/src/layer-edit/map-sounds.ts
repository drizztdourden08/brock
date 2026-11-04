/* @layer core @kind logic */
import type { LayerTransform, SoundsByChannel } from './msu-layer-edit.type';

const mapSounds = (sounds: SoundsByChannel, transform: LayerTransform): SoundsByChannel => {
  const next: SoundsByChannel = {};
  for (const [channel, defs] of Object.entries(sounds)) {
    next[channel] = defs?.map((def) => ({ ...def, layers: def.layers.map(transform) }));
  }
  return next;
};

export { mapSounds };
