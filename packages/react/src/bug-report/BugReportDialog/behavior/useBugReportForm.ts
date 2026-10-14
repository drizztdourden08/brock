/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { BugReportReceipt } from '@drizztdourden08/brock-core';
import { useProduct } from '../../../app/useProduct';
import { useDebugText } from '../../../diagnostics/useDebugText';
import { getAppLog } from '../../../log/get-app-log';
import { buildBugReportPayload } from '../../build-bug-report-payload';
import { useBugReportStore } from '../../useBugReportStore';
import { useBugReportTarget } from '../../useBugReportTarget';
import type { BugReportForm } from '../BugReportDialog.type';
import { announceReceipt } from './announce-receipt';
import { deliverReport } from './deliver-report';
import { useBugReportExtras } from './useBugReportExtras';

const useBugReportForm = (): BugReportForm => {
  const open = useBugReportStore((s) => s.open);
  const hide = useBugReportStore((s) => s.hide);
  const product = useProduct();
  const { text, system, version } = useDebugText(open);
  const target = useBugReportTarget(open);
  const extras = useBugReportExtras();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attach, setAttach] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<BugReportReceipt | null>(null);

  const diagnostics = attach ? text : null;
  const canSend = target !== null && !sending && title.trim().length > 0 && description.trim().length > 0 && (!attach || text !== null) && extras.valid;
  const { reset, contact, attachments, fields } = extras;
  const viaTransport = target?.kind === 'transport';

  const close = useCallback(() => {
    hide();
    setTitle('');
    setDescription('');
    setAttach(true);
    setError(null);
    setSent(null);
    reset();
  }, [hide, reset]);

  const send = useCallback(() => {
    if (!canSend) return;
    const payload = buildBugReportPayload({
      title, description, product, version, diagnostics, system: attach ? system : null, logs: attach ? getAppLog().getEntries() : [],
      ...(viaTransport ? { contact, attachments } : {}),
    });
    setSending(true);
    setError(null);
    void deliverReport(target, payload).then((result) => {
      setSending(false);
      if (!result.sent) setError(result.error);
      else if (fields.afterSend === 'view') setSent(result.receipt);
      else {
        announceReceipt(result.receipt);
        close();
      }
    });
  }, [canSend, target, title, description, product, version, diagnostics, attach, system, viaTransport, contact, attachments, fields.afterSend, close]);

  return { open, title, setTitle, description, setDescription, attach, setAttach, diagnostics, target, extras, sending, error, sent, canSend, send, close };
};

export { useBugReportForm };
