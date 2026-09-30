/* @layer renderer-shell @kind component */
import { Box, ProgressBar, Small, Text } from '@drizztdourden08/tessera/primitives';
import type { DownloadStatusProps } from '../UpdateDialog.type';

const DownloadStatus = (props: DownloadStatusProps) => {
  const { status, percent, error, canInstall, info } = props;

  return (
    <>
      {status === 'downloading' && (
        <Box className="update-dialog__progress">
          <ProgressBar value={percent} live />
          <Text variant="caption" className="update-dialog__progress-text">{`${Math.round(percent)}%`}</Text>
        </Box>
      )}
      {status === 'ready' && (
        <Small tone="success">Downloaded. The app closes and starts again on the new version.</Small>
      )}
      {!canInstall && info && (
        <Small tone="muted">This build cannot update itself. The release page has the download.</Small>
      )}
      {status === 'error' && <Small tone="danger">{`Update failed: ${error ?? 'unknown error'}`}</Small>}
    </>
  );
};

export { DownloadStatus };
