/* @layer renderer-shell @kind logic */
import type { BugReportReceipt } from '@drizztdourden08/brock-core';
import { openExternal } from '../../../host/open-external';
import { toast } from '../../../toast/toast';
import { OPEN_RECEIPT_LABEL, SENT_MESSAGE } from '../BugReportDialog.constants';

const announceReceipt = (receipt: BugReportReceipt): void => {
  const { message, url } = receipt;
  toast(message ?? SENT_MESSAGE, { variant: 'success', ...(url ? { action: { label: OPEN_RECEIPT_LABEL, onSelect: () => openExternal(url) } } : {}) });
};

export { announceReceipt };
