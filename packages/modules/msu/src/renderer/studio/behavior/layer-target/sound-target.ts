/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../../game/msu-studio-game.type';
import { layersOfSound, withSoundLayers } from '../sound-manifest';
import { isAdditiveChannel } from '../sound-channel-kind';
import { soundPreviewKey } from '../preview-key';
import { soundTitle } from '../../sound-labels';
import type { LayerTarget } from './layer-target.type';

const soundTarget = (game: MsuStudioGame<never, never>, channel: string, soundId: number): LayerTarget => ({
  previewKey: soundPreviewKey(channel, soundId),
  label: soundTitle(game, channel, soundId),
  read: (manifest) => layersOfSound(manifest, channel, soundId),
  write: (base, layers) => withSoundLayers(base, channel, soundId, layers),
  oneShot: isAdditiveChannel(game.config, channel),
});

export { soundTarget };
