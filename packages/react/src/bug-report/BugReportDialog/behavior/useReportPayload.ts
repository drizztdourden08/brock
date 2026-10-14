/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { BugReportPayload } from '@drizztdourden08/brock-core';
import { useProduct } from '../../../app/useProduct';
import { useDebugText } from '../../../diagnostics/useDebugText';
import { getAppLog } from '../../../log/get-app-log';
import { buildBugReportPayload } from '../../build-bug-report-payload';
import type { BugReportTargetFields } from '../../bug-report.type';
import type { ReportPayloadModel } from '../BugReportDialog.type';
import { useAttachments } from './useAttachments';
import { useReportExtras } from './useReportExtras';

const useReportPayload = (open: boolean, fields: BugReportTargetFields | null): ReportPayloadModel => {
  const product = useProduct();
  const { text, system, version } = useDebugText(open);
  const takeExtras = useReportExtras(open);
  const attachments = useAttachments(fields?.attachments ?? null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [attach, setAttach] = useState(true);
  const resetAttachments = attachments.reset;

  const reset = useCallback(() => {
    setTitle('');
    setDescription('');
    setContact('');
    setAttach(true);
    resetAttachments();
  }, [resetAttachments]);

  const build = useCallback(async (): Promise<BugReportPayload> => buildBugReportPayload({
    title, description, product, version, diagnostics: attach ? text : null, system: attach ? system : null, logs: attach ? getAppLog().getEntries() : [],
    ...(fields?.contact ? { contact } : {}),
    ...(fields?.attachments ? { attachments: attachments.files } : {}),
    extras: await takeExtras(),
  }), [title, description, product, version, attach, text, system, fields, contact, attachments.files, takeExtras]);

  const filled = title.trim().length > 0 && description.trim().length > 0 && (!attach || text !== null);

  return {
    title, setTitle, description, setDescription, contact, setContact, attach, setAttach,
    diagnostics: attach ? text : null, attachments, filled, build, reset,
  };
};

export { useReportPayload };
