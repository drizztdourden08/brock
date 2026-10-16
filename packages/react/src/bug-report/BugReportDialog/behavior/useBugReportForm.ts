/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { BugReportReceipt } from '@drizztdourden08/brock-core';
import { useProduct } from '../../../app/useProduct';
import type { BugReportTarget } from '../../bug-report.type';
import { fallbackTarget } from '../../fallback-target';
import { fieldsOf } from '../../fields-of';
import { useBugReportStore } from '../../useBugReportStore';
import { useBugReportTarget } from '../../useBugReportTarget';
import type { BugReportForm } from '../BugReportDialog.type';
import { announceReceipt } from './announce-receipt';
import { deliverReport } from './deliver-report';
import { useReceiptRetry } from './useReceiptRetry';
import { useReportPayload } from './useReportPayload';

const useBugReportForm = (): BugReportForm => {
  const open = useBugReportStore((s) => s.open);
  const hide = useBugReportStore((s) => s.hide);
  const section = useBugReportStore((s) => s.appTransport?.section ?? null);
  const { repo } = useProduct();
  const target = useBugReportTarget(open);
  const fields = fieldsOf(target);
  const draft = useReportPayload(open, fields);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<BugReportReceipt | null>(null);
  const retry = useReceiptRetry(sent, setSent);
  const { build, reset } = draft;

  const canSend = target !== null && !sending && draft.filled;

  const close = useCallback(() => {
    hide();
    reset();
    setError(null);
    setSent(null);
  }, [hide, reset]);

  const deliverTo = useCallback((to: BugReportTarget) => {
    let shown = fieldsOf(to)?.afterSend === 'view';
    const onReceipt = (receipt: BugReportReceipt): void => {
      shown = shown || receipt.retry !== undefined;
      if (shown) setSent(receipt);
      else announceReceipt(receipt);
    };
    setSending(true);
    setError(null);
    void build().then((payload) => deliverReport(to, payload, onReceipt)).then((failure) => {
      setSending(false);
      if (failure !== null) setError(failure);
      else if (!shown) close();
    });
  }, [build, close]);

  const send = useCallback(() => {
    if (canSend) deliverTo(target);
  }, [canSend, target, deliverTo]);

  const fallbackTo = sending ? null : fallbackTarget(error, target, repo);
  const fallback = fallbackTo ? () => deliverTo(fallbackTo) : null;

  return { ...draft, open, target, fields, section, sending, error, sent, retry, canSend, send, fallback, close };
};

export { useBugReportForm };
