/* @layer renderer-shell @kind logic */
import type { BugReportReceipt } from '@drizztdourden08/brock-core';
import { openExternal } from '../../../host/open-external';
import { toast } from '../../../toast/toast';
import { SENT_MESSAGE } from '../BugReportDialog.constants';
import { receiptLinks } from './receipt-links';

const announceReceipt = (receipt: BugReportReceipt): void => {
  const [link] = receiptLinks(receipt);
  toast(receipt.message ?? SENT_MESSAGE, { variant: 'success', ...(link ? { action: { label: link.label, onSelect: () => openExternal(link.url) } } : {}) });
};

export { announceReceipt };
