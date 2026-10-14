/* @layer renderer-shell @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { BugReportAttachment } from '@drizztdourden08/brock-core';
import { bugReportFields } from '../../bug-report-fields';
import { isEmail } from '../../is-email';
import { readAttachments } from '../../read-attachments';
import { useBugReportStore } from '../../useBugReportStore';
import type { BugReportExtras } from '../BugReportDialog.type';
import { CONTACT_INVALID, CONTACT_MISSING } from '../BugReportDialog.constants';

const contactProblem = (contact: string, required: boolean): string | null => {
  if (contact.trim() === '') return required ? CONTACT_MISSING : null;
  return isEmail(contact) ? null : CONTACT_INVALID;
};

const useBugReportExtras = (): BugReportExtras => {
  const app = useBugReportStore((s) => s.appTransport);
  const fields = useMemo(() => bugReportFields(app), [app]);
  const [contact, setContact] = useState('');
  const [attachments, setAttachments] = useState<readonly BugReportAttachment[]>([]);
  const [refused, setRefused] = useState<readonly string[]>([]);

  const addFiles = useCallback((files: File[]) => {
    if (!fields.attachments) return;
    void readAttachments(files, attachments, fields.attachments).then(({ added, refused: turnedAway }) => {
      setAttachments((held) => [...held, ...added]);
      setRefused(turnedAway);
    });
  }, [fields.attachments, attachments]);
  const removeAttachment = useCallback((index: number) => setAttachments((held) => held.filter((_, at) => at !== index)), []);
  const reset = useCallback(() => {
    setContact('');
    setAttachments([]);
    setRefused([]);
  }, []);

  const contactError = fields.contact ? contactProblem(contact, fields.contact.required) : null;
  return { fields, contact, setContact, contactError, attachments, addFiles, removeAttachment, refused, valid: contactError === null, reset };
};

export { useBugReportExtras };
