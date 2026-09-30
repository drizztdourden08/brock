/* @layer renderer-shell @kind component */
import { P, Small, Strong } from '@drizztdourden08/tessera/primitives';
import type { UpdateSummaryProps } from '../UpdateDialog.type';

const UpdateSummary = (props: UpdateSummaryProps) => {
  const { status, info, currentVersion, capabilities } = props;

  if (!capabilities.hasSource) {
    return <Small tone="muted">This app has no update source, so it cannot check for updates.</Small>;
  }
  if (!capabilities.canCheck) {
    return <Small tone="muted">This build does not check for updates.</Small>;
  }

  return (
    <>
      {status === 'checking' && <Small tone="muted">Checking for newer version...</Small>}
      {info && (
        <P className="update-dialog__version">
          Version <Strong>{info.version}</Strong> is available
        </P>
      )}
      {status !== 'checking' && !info && (
        <P className="update-dialog__version">
          Version <Strong>{currentVersion}</Strong> is the latest
        </P>
      )}
    </>
  );
};

export { UpdateSummary };
