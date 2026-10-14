/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { useProduct } from '../../../app/useProduct';
import type { BugReportTarget } from '../../bug-report.type';
import { fallbackTarget } from '../../fallback-target';
import { fieldsOf } from '../../fields-of';
import { useBugReportStore } from '../../useBugReportStore';
import { useBugReportTarget } from '../../useBugReportTarget';
import type { BugReportForm } from '../BugReportDialog.type';
import { deliverReport } from './deliver-report';
import { useReportPayload } from './useReportPayload';

const useBugReportForm = (): BugReportForm => {
  const open = useBugReportStore((s) => s.open);
  const hide = useBugReportStore((s) => s.hide);
  const { repo } = useProduct();
  const target = useBugReportTarget(open);
  const fields = fieldsOf(target);
  const draft = useReportPayload(open, fields);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { build, reset } = draft;

  const canSend = target !== null && !sending && draft.filled;

  const close = useCallback(() => {
    hide();
    reset();
    setError(null);
  }, [hide, reset]);

  const deliverTo = useCallback((to: BugReportTarget) => {
    setSending(true);
    setError(null);
    void build().then((payload) => deliverReport(to, payload)).then((failure) => {
      setSending(false);
      if (failure === null) close();
      else setError(failure);
    });
  }, [build, close]);

  const send = useCallback(() => {
    if (canSend) deliverTo(target);
  }, [canSend, target, deliverTo]);

  const fallbackTo = sending ? null : fallbackTarget(error, target, repo);
  const fallback = fallbackTo ? () => deliverTo(fallbackTo) : null;

  return { ...draft, open, target, fields, sending, error, canSend, send, fallback, close };
};

export { useBugReportForm };
