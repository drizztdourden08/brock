/* @layer renderer-shell @kind logic */
import type { BugReportReceipt } from '@drizztdourden08/brock-core';
import { OPEN_RECEIPT_LABEL } from '../BugReportDialog.constants';
import type { ReceiptLink } from '../BugReportDialog.type';

const receiptLinks = ({ url, links = [] }: BugReportReceipt): ReceiptLink[] =>
  (url === undefined || links.some((link) => link.url === url) ? links : [{ label: OPEN_RECEIPT_LABEL, url }, ...links]);

export { receiptLinks };
