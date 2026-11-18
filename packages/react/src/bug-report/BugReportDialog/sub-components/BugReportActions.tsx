/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import { useText } from '../../../i18n';
import { openExternal } from '../../../host/open-external';
import { receiptLinks } from '../behavior/receipt-links';
import { CANCEL_LABEL, CLOSE_LABEL, SENDING_LABEL } from '../BugReportDialog.constants';
import type { BugReportActionsProps } from './BugReportActions.type';

const BugReportActions = (props: BugReportActionsProps) => {
  const { form } = props;
  const text = useText();

  if (form.sent) {
    return (
      <>
        {receiptLinks(form.sent).map((link) => (
          <Button key={`${link.label}-${link.url}`} variant="tertiary" onClick={() => openExternal(link.url)}>{text(link.label)}</Button>
        ))}
        <Button variant="primary" onClick={form.close}>{text(CLOSE_LABEL)}</Button>
      </>
    );
  }

  return (
    <>
      <Button variant="tertiary" onClick={form.close} disabled={form.sending}>{text(CANCEL_LABEL)}</Button>
      <Button variant="primary" onClick={form.send} disabled={!form.canSend} loading={form.sending}>
        {text(form.sending ? SENDING_LABEL : form.target?.label ?? SENDING_LABEL)}
      </Button>
    </>
  );
};

export { BugReportActions };
