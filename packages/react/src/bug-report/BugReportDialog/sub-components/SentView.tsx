/* @layer renderer-shell @kind component */
import { Button, Callout, Small, Stack } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../../i18n';
import { RETRY_LABEL, SENT_MESSAGE } from '../BugReportDialog.constants';
import type { SentViewProps } from './SentView.type';

const SentView = (props: SentViewProps) => {
  const { receipt, retry } = props;
  const { run, retrying, error } = retry;
  const t = useT();
  const text = useText();
  const action = run === null ? undefined : (
    <Button variant="secondary" size="sm" onClick={run} loading={retrying} disabled={retrying}>{text(RETRY_LABEL)}</Button>
  );

  return (
    <Stack gap="sm" className="bug-report__sent">
      <Callout tone={run === null ? 'success' : 'warning'} action={action}>{receipt.message ?? text(SENT_MESSAGE)}</Callout>
      {error !== null && <Callout tone="danger">{t('brock-app:bugReport.retryFailed', { error })}</Callout>}
      {receipt.id !== undefined && <Small tone="muted">{t('brock-app:bugReport.sentId', { id: receipt.id })}</Small>}
    </Stack>
  );
};

export { SentView };
