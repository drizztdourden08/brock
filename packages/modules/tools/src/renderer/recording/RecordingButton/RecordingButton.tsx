/* @layer renderer-shell @kind component */
import { Box, Button } from '@drizztdourden08/tessera/primitives';
import { FfmpegRequiredDialog } from '../FfmpegRequiredDialog';
import { useRecordingCapture } from './behavior/useRecordingCapture';
import { RecordingTimer } from './sub-components/RecordingTimer';
import { DEFAULT_START_LABEL, DEFAULT_STOP_LABEL } from './RecordingButton.constants';
import type { RecordingButtonProps } from './RecordingButton.type';
import './RecordingButton.css';

const RecordingButton = ({ startLabel = DEFAULT_START_LABEL, stopLabel = DEFAULT_STOP_LABEL, ...options }: RecordingButtonProps) => {
  const { isCapturing, startedAt, handleClick, showFfmpegPrompt, resolveFfmpegPrompt } = useRecordingCapture(options);

  return (
    <Box className={`recording-button${isCapturing ? ' recording-button--active' : ''}`}>
      <Button
        variant={isCapturing ? 'tertiary' : 'primary'}
        aria-pressed={isCapturing}
        onClick={() => { void handleClick(); }}
      >
        {isCapturing ? stopLabel : startLabel}
      </Button>
      {isCapturing && startedAt !== null && <RecordingTimer startedAt={startedAt} />}
      <FfmpegRequiredDialog open={showFfmpegPrompt} onClose={resolveFfmpegPrompt} />
    </Box>
  );
};

export { RecordingButton };
