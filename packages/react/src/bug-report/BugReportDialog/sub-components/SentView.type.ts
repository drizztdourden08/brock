/* @layer renderer-shell @kind types */
import type { BugReportReceipt } from '@drizztdourden08/brock-core';
import type { ReceiptRetry } from '../BugReportDialog.type';

interface SentViewProps {
  receipt: BugReportReceipt;
  retry: ReceiptRetry;
}

export type { SentViewProps };
