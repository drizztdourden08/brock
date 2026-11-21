/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { TaskProgress } from '@drizztdourden08/tessera/composites';
import { Small } from '@drizztdourden08/tessera/primitives';
import type { DownloadStatusProps } from '../UpdateDialog.type';

const DownloadStatus = (props: DownloadStatusProps) => {
  const { status, percent, error, canInstall, info } = props;
  const text = useText();
  const label = text(msg('updater:download.label'));
  const line = text(info ? msg('updater:download.line', { version: info.version }) : msg('updater:download.lineGeneric'));
  const reason = error ?? text(msg('updater:download.unknownError'));

  return (
    <>
      {status === 'downloading' && <TaskProgress state="running" percent={percent} line={line} label={label} />}
      {status === 'ready' && <Small tone="success">{text(msg('updater:download.ready'))}</Small>}
      {!canInstall && info && <Small tone="muted">{text(msg('updater:download.cannotInstall'))}</Small>}
      {status === 'error' && (
        <TaskProgress
          state="failed"
          line={text(msg('updater:download.failedLine'))}
          error={text(msg('updater:download.failed', { error: reason }))}
          label={label}
        />
      )}
    </>
  );
};

export { DownloadStatus };
