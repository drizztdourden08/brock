/* @layer renderer-shell @kind component */
import { useMsuStudioGame } from '../game/useMsuStudioGame';
import { PlayToggleButtons } from './PlayToggleButtons';
import type { SoundPlayButtonsProps } from './SoundPlayButtons.type';

const SoundPlayButtons = (props: SoundPlayButtonsProps) => {
  const { row, channel, playing, additive, playingOriginal, onPreview, onStopPreview, onPlayOriginal } = props;
  const { soundId, hex, layerCount } = row;
  const { preview } = useMsuStudioGame<never, never>();

  return (
    <PlayToggleButtons
      subject={hex}
      playLabel={`Play this pack's ${hex}`}
      hasReplacement={layerCount > 0}
      playing={playing}
      stoppable={playing && !additive}
      playingOriginal={playingOriginal}
      onPlay={() => onPreview(channel, soundId)}
      onStop={onStopPreview}
      onPlayOriginal={preview === undefined ? undefined : () => onPlayOriginal(soundId)}
    />
  );
};

export { SoundPlayButtons };
