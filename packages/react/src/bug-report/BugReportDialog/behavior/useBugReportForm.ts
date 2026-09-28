/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { useProduct } from '../../../app/useProduct';
import { useDebugText } from '../../../diagnostics/useDebugText';
import { openExternal } from '../../../host/open-external';
import { writeClipboard } from '../../../host/write-clipboard';
import { toast } from '../../../toast/toast';
import { buildIssueBody } from '../../build-issue-body';
import { buildIssueUrl } from '../../build-issue-url';
import { useBugReportStore } from '../../useBugReportStore';
import { COPIED_MESSAGE, COPY_FAILED_MESSAGE, OPENED_MESSAGE } from '../BugReportDialog.constants';
import type { BugReportForm } from '../BugReportDialog.type';

const copyReport = async (title: string, body: string): Promise<void> => {
  const copied = await writeClipboard(`${title.trim()}\n\n${body}`);
  toast(copied ? COPIED_MESSAGE : COPY_FAILED_MESSAGE, { variant: copied ? 'success' : 'danger' });
};

const useBugReportForm = (): BugReportForm => {
  const open = useBugReportStore((s) => s.open);
  const hide = useBugReportStore((s) => s.hide);
  const { repo } = useProduct();
  const { text } = useDebugText(open);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attach, setAttach] = useState(true);

  const diagnostics = attach ? text : null;
  const canSend = title.trim().length > 0 && description.trim().length > 0 && (!attach || text !== null);

  const close = useCallback(() => {
    hide();
    setTitle('');
    setDescription('');
    setAttach(true);
  }, [hide]);

  const send = useCallback(() => {
    if (!canSend) return;
    if (repo) {
      openExternal(buildIssueUrl({ repo, title, description, diagnostics }));
      toast(OPENED_MESSAGE, { variant: 'success' });
    } else {
      void copyReport(title, buildIssueBody(description, diagnostics));
    }
    close();
  }, [canSend, repo, title, description, diagnostics, close]);

  return {
    open, title, setTitle, description, setDescription, attach, setAttach,
    diagnostics, hasRepo: repo !== undefined, canSend, send, close,
  };
};

export { useBugReportForm };
