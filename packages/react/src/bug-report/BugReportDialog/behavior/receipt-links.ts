/* @layer renderer-shell @kind logic */
import type { BugReportLink, BugReportReceipt } from '@drizztdourden08/brock-core';
import { OPEN_RECEIPT_LABEL } from '../BugReportDialog.constants';

const receiptLinks = ({ url, links = [] }: BugReportReceipt): BugReportLink[] =>
  (url === undefined || links.some((link) => link.url === url) ? links : [{ label: OPEN_RECEIPT_LABEL, url }, ...links]);

export { receiptLinks };
