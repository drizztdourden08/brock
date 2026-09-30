/* @layer renderer-shell @kind component */
import { Box, ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import type { DownloadStatusProps } from '../UpdateDialog.type';

const DownloadStatus = (props: DownloadStatusProps) => {
  const { status, percent, error, canInstall, info } = props;

  return (
    <>
      {status === 'downloading' && (
        <Box className="update-dialog__progress">
          <ProgressBar value={percent} live />
          <Text className="update-dialog__progress-text">{`${Math.round(percent)}%`}</Text>
        </Box>
      )}
      {status === 'ready' && (
        <Text as="p" className="update-dialog__ready">
          Downloaded. The app closes and starts again on the new version.
        </Text>
      )}
      {!canInstall && info && (
        <Text as="p" className="update-dialog__status">
          This build cannot update itself. The release page has the download.
        </Text>
      )}
      {status === 'error' && <Text as="p" className="update-dialog__error">{`Update failed: ${error ?? 'unknown error'}`}</Text>}
    </>
  );
};

export { DownloadStatus };
