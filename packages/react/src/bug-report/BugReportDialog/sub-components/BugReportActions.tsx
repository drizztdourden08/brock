/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import { openExternal } from '../../../host/open-external';
import { CLOSE_LABEL, OPEN_RECEIPT_LABEL, SENDING_LABEL } from '../BugReportDialog.constants';
import type { BugReportActionsProps } from './BugReportActions.type';

const BugReportActions = (props: BugReportActionsProps) => {
  const { form } = props;
  const receiptUrl = form.sent?.url;

  if (form.sent) {
    return (
      <>
        {receiptUrl !== undefined && <Button variant="tertiary" onClick={() => openExternal(receiptUrl)}>{OPEN_RECEIPT_LABEL}</Button>}
        <Button variant="primary" onClick={form.close}>{CLOSE_LABEL}</Button>
      </>
    );
  }

  return (
    <>
      <Button variant="tertiary" onClick={form.close} disabled={form.sending}>Cancel</Button>
      <Button variant="primary" onClick={form.send} disabled={!form.canSend} loading={form.sending}>
        {form.sending ? SENDING_LABEL : form.target?.label ?? SENDING_LABEL}
      </Button>
    </>
  );
};

export { BugReportActions };
