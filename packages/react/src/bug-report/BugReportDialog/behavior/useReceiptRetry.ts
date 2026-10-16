/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { BugReportReceipt } from '@drizztdourden08/brock-core';
import type { ReceiptRetry, RetryFailure } from '../BugReportDialog.type';
import { settleTransport } from './settle-transport';

const useReceiptRetry = (sent: BugReportReceipt | null, setSent: Dispatch<SetStateAction<BugReportReceipt | null>>): ReceiptRetry => {
  const [running, setRunning] = useState<BugReportReceipt | null>(null);
  const [failure, setFailure] = useState<RetryFailure | null>(null);

  const retry = useCallback((receipt: BugReportReceipt, run: NonNullable<BugReportReceipt['retry']>) => {
    setRunning(receipt);
    setFailure(null);
    void settleTransport(run).then((result) => {
      setRunning((now) => (now === receipt ? null : now));
      if (result.success) setSent((now) => (now === receipt ? result.value : now));
      else setFailure({ receipt, error: result.error });
    });
  }, [setSent]);

  const run = sent?.retry;
  return {
    run: sent && run ? () => retry(sent, run) : null,
    retrying: sent !== null && running === sent,
    error: sent !== null && failure?.receipt === sent ? failure.error : null,
  };
};

export { useReceiptRetry };
