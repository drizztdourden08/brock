/* @layer renderer-shell @kind component */
import { Box, ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import type { DownloadStatusProps } from '../UpdateDialog.type';

const DownloadStatus = (props: DownloadStatusProps) => {
  const { status, percent, error } = props;

  if (status === 'downloading') {
    return (
      <Box className="update-dialog__progress">
        <ProgressBar value={percent} live />
        <Text className="update-dialog__progress-text">{`${Math.round(percent)}%`}</Text>
      </Box>
    );
  }
  if (status === 'ready') {
    return (
      <Text as="p" className="update-dialog__ready">
        Downloaded. The app closes and starts again on the new version.
      </Text>
    );
  }
  if (status === 'error') {
    return <Text as="p" className="update-dialog__error">{`The update failed: ${error ?? 'unknown error'}`}</Text>;
  }
  return null;
};

export { DownloadStatus };
