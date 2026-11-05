/* @layer renderer-shell @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { useMsuStudioGame } from '../game/useMsuStudioGame';
import { PlayOriginalButton } from './PlayOriginalButton';
import type { PlayToggleButtonsProps } from './PlayToggleButtons.type';

const PlayToggleButtons = (props: PlayToggleButtonsProps) => {
  const { subject, playLabel, hasReplacement, playing, playingOriginal, onPlay, onStop, onPlayOriginal } = props;
  const canCompare = useMsuStudioGame<never, never>().preview !== undefined;
  const stoppable = props.stoppable ?? playing;

  return (
    <>
      {hasReplacement && (
        <IconButton
          variant="ghost"
          size="sm"
          label={stoppable ? `Stop ${subject}` : playLabel}
          active={playing}
          onClick={stoppable ? onStop : onPlay}
        >
          <Icon name={stoppable ? 'square' : 'play'} />
        </IconButton>
      )}
      {canCompare && onPlayOriginal !== undefined && (
        <PlayOriginalButton
          subject={subject}
          hasReplacement={hasReplacement}
          playingOriginal={playingOriginal}
          onPlayOriginal={onPlayOriginal}
        />
      )}
    </>
  );
};

export { PlayToggleButtons };
