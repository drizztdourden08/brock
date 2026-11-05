/* @layer renderer-shell @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import type { PlayOriginalButtonProps } from './PlayOriginalButton.type';

const PlayOriginalButton = (props: PlayOriginalButtonProps) => {
  const { subject, hasReplacement, playingOriginal, onPlayOriginal } = props;
  return (
    <IconButton
      variant="ghost"
      size="sm"
      label={playingOriginal
        ? `Stop ${subject}`
        : `Play the sound chip's own ${subject}${hasReplacement ? ', to compare' : ''}`}
      active={playingOriginal}
      onClick={onPlayOriginal}
    >
      <Icon name={playingOriginal ? 'square' : 'volume-2'} />
    </IconButton>
  );
};

export { PlayOriginalButton };
