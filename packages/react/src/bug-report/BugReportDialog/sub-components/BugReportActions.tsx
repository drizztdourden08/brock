/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import { openExternal } from '../../../host/open-external';
import { receiptLinks } from '../behavior/receipt-links';
import { CLOSE_LABEL, SENDING_LABEL } from '../BugReportDialog.constants';
import type { BugReportActionsProps } from './BugReportActions.type';

const BugReportActions = (props: BugReportActionsProps) => {
  const { form } = props;

  if (form.sent) {
    return (
      <>
        {receiptLinks(form.sent).map((link) => (
          <Button key={`${link.label}-${link.url}`} variant="tertiary" onClick={() => openExternal(link.url)}>{link.label}</Button>
        ))}
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
