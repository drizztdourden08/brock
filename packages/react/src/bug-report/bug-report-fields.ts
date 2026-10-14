/* @layer renderer-shell @kind logic */
import { ATTACHMENT_BYTES, ATTACHMENT_FILES, CONTACT_HINT, CONTACT_LABEL } from './bug-report.constants';
import type { BrockAppBugReport, BugReportAttachmentField, BugReportContactField, BugReportFields } from './bug-report.type';

const contactField = (given: BrockAppBugReport['contact']): BugReportContactField | null => {
  if (given === undefined || given === false) return null;
  const options = given === true ? {} : given;
  return { required: options.required === true, label: options.label ?? CONTACT_LABEL, hint: options.hint ?? CONTACT_HINT };
};

const attachmentField = (given: BrockAppBugReport['attachments']): BugReportAttachmentField | null => {
  if (given === undefined || given === false) return null;
  const options = given === true ? {} : given;
  return { accept: options.accept ?? [], maxFiles: options.maxFiles ?? ATTACHMENT_FILES, maxBytes: options.maxBytes ?? ATTACHMENT_BYTES };
};

const bugReportFields = (app: BrockAppBugReport | null): BugReportFields => ({
  contact: contactField(app?.contact),
  attachments: attachmentField(app?.attachments),
  afterSend: app?.afterSend ?? 'toast',
});

export { bugReportFields };
