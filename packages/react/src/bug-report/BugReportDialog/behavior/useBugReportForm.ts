/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { useProduct } from '../../../app/useProduct';
import { useDebugText } from '../../../diagnostics/useDebugText';
import { getAppLog } from '../../../log/get-app-log';
import { buildBugReportPayload } from '../../build-bug-report-payload';
import { useBugReportStore } from '../../useBugReportStore';
import { useBugReportTarget } from '../../useBugReportTarget';
import type { BugReportForm } from '../BugReportDialog.type';
import { deliverReport } from './deliver-report';

const useBugReportForm = (): BugReportForm => {
  const open = useBugReportStore((s) => s.open);
  const hide = useBugReportStore((s) => s.hide);
  const product = useProduct();
  const { text, system, version } = useDebugText(open);
  const target = useBugReportTarget(open);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attach, setAttach] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const diagnostics = attach ? text : null;
  const canSend = target !== null && !sending && title.trim().length > 0 && description.trim().length > 0 && (!attach || text !== null);

  const close = useCallback(() => {
    hide();
    setTitle('');
    setDescription('');
    setAttach(true);
    setError(null);
  }, [hide]);

  const send = useCallback(() => {
    if (!canSend) return;
    const payload = buildBugReportPayload({ title, description, product, version, diagnostics, system: attach ? system : null, logs: attach ? getAppLog().getEntries() : [] });
    setSending(true);
    setError(null);
    void deliverReport(target, payload).then((failure) => {
      setSending(false);
      if (failure === null) close();
      else setError(failure);
    });
  }, [canSend, target, title, description, product, version, diagnostics, attach, system, close]);

  return { open, title, setTitle, description, setDescription, attach, setAttach, diagnostics, target, sending, error, canSend, send, close };
};

export { useBugReportForm };
