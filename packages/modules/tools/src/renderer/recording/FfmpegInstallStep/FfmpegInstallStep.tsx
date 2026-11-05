/* @layer renderer-shell @kind component */
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { installLabel } from './behavior/install-label';
import type { FfmpegInstallStepProps } from './FfmpegInstallStep.type';
import './FfmpegInstallStep.css';

const FfmpegInstallStep = ({ state, installing, error, onInstall }: FfmpegInstallStepProps) => {
  if (state === null) return <Text className="ffmpeg-install-step__note">Checking for the tool...</Text>;

  if (state.status === 'unavailable') {
    return (
      <Box className="ffmpeg-install-step">
        <Text className="ffmpeg-install-step__note">{state.hint}</Text>
      </Box>
    );
  }

  return (
    <Box className="ffmpeg-install-step">
      <Text className="ffmpeg-install-step__note">This needs ffmpeg, which is not shipped with the app.</Text>
      <Text className="ffmpeg-install-step__note ffmpeg-install-step__note--faint">
        A one-time download, checked against its published checksum and kept in the app&apos;s data folder.
      </Text>
      {error !== null && <Text className="ffmpeg-install-step__note ffmpeg-install-step__note--bad">{error}</Text>}
      <Button variant="primary" disabled={installing} onClick={onInstall}>
        {installLabel(installing, error)}
      </Button>
    </Box>
  );
};

export { FfmpegInstallStep };
