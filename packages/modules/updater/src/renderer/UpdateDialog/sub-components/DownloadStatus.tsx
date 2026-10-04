/* @layer renderer-shell @kind component */
import { TaskProgress } from '@drizztdourden08/tessera/composites';
import { Small } from '@drizztdourden08/tessera/primitives';
import type { DownloadStatusProps } from '../UpdateDialog.type';

const DownloadStatus = (props: DownloadStatusProps) => {
  const { status, percent, error, canInstall, info } = props;
  const line = info ? `Downloading ${info.version}` : 'Downloading the update';

  return (
    <>
      {status === 'downloading' && <TaskProgress state="running" percent={percent} line={line} label="Update download" />}
      {status === 'ready' && (
        <Small tone="success">Downloaded. The app closes and starts again on the new version.</Small>
      )}
      {!canInstall && info && (
        <Small tone="muted">This build cannot update itself. The release page has the download.</Small>
      )}
      {status === 'error' && <TaskProgress state="failed" line="The update did not install" error={`Update failed: ${error ?? 'unknown error'}`} label="Update download" />}
    </>
  );
};

export { DownloadStatus };
