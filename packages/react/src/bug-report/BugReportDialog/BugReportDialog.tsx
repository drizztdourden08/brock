/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { openExternal } from '../../host/open-external';
import { useBugReportForm } from './behavior/useBugReportForm';
import { BugReportFormBody } from './sub-components/BugReportFormBody';
import { SentView } from './sub-components/SentView';
import { CLOSE_LABEL, OPEN_RECEIPT_LABEL, SENDING_LABEL, SENT_TITLE } from './BugReportDialog.constants';
import './BugReportDialog.css';

const BugReportDialog = () => {
  const form = useBugReportForm();
  const { sent } = form;
  const receiptUrl = sent?.url;

  const actions = sent
    ? (
      <>
        {receiptUrl !== undefined && <Button variant="tertiary" onClick={() => openExternal(receiptUrl)}>{OPEN_RECEIPT_LABEL}</Button>}
        <Button variant="primary" onClick={form.close}>{CLOSE_LABEL}</Button>
      </>
    )
    : (
      <>
        <Button variant="tertiary" onClick={form.close} disabled={form.sending}>Cancel</Button>
        <Button variant="primary" onClick={form.send} disabled={!form.canSend} loading={form.sending}>
          {form.sending ? SENDING_LABEL : form.target?.label ?? SENDING_LABEL}
        </Button>
      </>
    );

  return (
    <DialogShell open={form.open} onClose={form.close} title={sent ? SENT_TITLE : 'Report a bug'} className="bug-report" actions={actions}>
      {sent ? <SentView receipt={sent} /> : <BugReportFormBody form={form} />}
    </DialogShell>
  );
};

export { BugReportDialog };
