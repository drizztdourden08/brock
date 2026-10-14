/* @layer renderer-shell @kind component */
import { Callout, Small, Stack } from '@drizztdourden08/tessera/primitives';
import { SENT_ID_LABEL, SENT_MESSAGE } from '../BugReportDialog.constants';
import type { SentViewProps } from './SentView.type';

const SentView = (props: SentViewProps) => {
  const { receipt } = props;
  return (
    <Stack gap="sm" className="bug-report__sent">
      <Callout tone="success">{receipt.message ?? SENT_MESSAGE}</Callout>
      {receipt.id !== undefined && <Small tone="muted">{`${SENT_ID_LABEL} ${receipt.id}`}</Small>}
    </Stack>
  );
};

export { SentView };
