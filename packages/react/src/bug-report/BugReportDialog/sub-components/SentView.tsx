/* @layer renderer-shell @kind component */
import { Button, Callout, Small, Stack } from '@drizztdourden08/tessera/primitives';
import { RETRY_FAILED, RETRY_LABEL, SENT_ID_LABEL, SENT_MESSAGE } from '../BugReportDialog.constants';
import type { SentViewProps } from './SentView.type';

const SentView = (props: SentViewProps) => {
  const { receipt, retry } = props;
  const { run, retrying, error } = retry;
  const action = run === null ? undefined : (
    <Button variant="secondary" size="sm" onClick={run} loading={retrying} disabled={retrying}>{RETRY_LABEL}</Button>
  );

  return (
    <Stack gap="sm" className="bug-report__sent">
      <Callout tone={run === null ? 'success' : 'warning'} action={action}>{receipt.message ?? SENT_MESSAGE}</Callout>
      {error !== null && <Callout tone="danger">{`${RETRY_FAILED} ${error}`}</Callout>}
      {receipt.id !== undefined && <Small tone="muted">{`${SENT_ID_LABEL} ${receipt.id}`}</Small>}
    </Stack>
  );
};

export { SentView };
