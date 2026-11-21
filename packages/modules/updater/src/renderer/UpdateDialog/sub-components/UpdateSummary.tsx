/* @layer renderer-shell @kind component */
import type { ReactNode } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { Trans, useText } from '@drizztdourden08/brock-react';
import { P, Small, Strong } from '@drizztdourden08/tessera/primitives';
import type { UpdateSummaryProps } from '../UpdateDialog.type';

const UpdateSummary = (props: UpdateSummaryProps) => {
  const { status, info, currentVersion, capabilities } = props;
  const text = useText();
  const tags = { strong: (chunks: readonly ReactNode[]) => <Strong>{chunks}</Strong> };

  if (!capabilities.hasSource) {
    return <Small tone="muted">{text(msg('updater:summary.noSource'))}</Small>;
  }
  if (!capabilities.canCheck) {
    return <Small tone="muted">{text(msg('updater:summary.noCheck'))}</Small>;
  }

  return (
    <>
      {status === 'checking' && <Small tone="muted">{text(msg('updater:summary.checking'))}</Small>}
      {info && (
        <P className="update-dialog__version">
          <Trans k="updater:summary.available" values={{ version: info.version }} tags={tags} />
        </P>
      )}
      {status !== 'checking' && !info && (
        <P className="update-dialog__version">
          <Trans k="updater:summary.latest" values={{ version: currentVersion }} tags={tags} />
        </P>
      )}
    </>
  );
};

export { UpdateSummary };
