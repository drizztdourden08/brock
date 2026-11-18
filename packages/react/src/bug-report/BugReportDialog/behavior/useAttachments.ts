/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { BugReportAttachment, BugReportAttachmentLimits } from '@drizztdourden08/brock-core';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { admitAttachments } from '../../admit-attachments';
import type { AttachmentsModel } from '../BugReportDialog.type';

const readAttachment = async (file: File): Promise<BugReportAttachment> => ({
  name: file.name, type: file.type, size: file.size, data: new Uint8Array(await file.arrayBuffer()),
});

const useAttachments = (limits: BugReportAttachmentLimits | null): AttachmentsModel => {
  const [files, setFiles] = useState<BugReportAttachment[]>([]);
  const [refused, setRefused] = useState<Text | null>(null);

  const add = useCallback((picked: File[]) => {
    if (!limits) return;
    const admission = admitAttachments(files, picked, limits);
    setRefused(admission.refused);
    void Promise.all(admission.admitted.map(readAttachment))
      .then((read) => setFiles((now) => [...now, ...read]))
      .catch(() => setRefused(msg('brock-app:bugReport.attach.unreadable')));
  }, [files, limits]);

  const remove = useCallback((index: number) => {
    setFiles((now) => now.filter((_, at) => at !== index));
    setRefused(null);
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setRefused(null);
  }, []);

  return { files, refused, limits, add, remove, reset };
};

export { useAttachments };
