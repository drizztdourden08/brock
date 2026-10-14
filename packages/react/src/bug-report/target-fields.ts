/* @layer renderer-shell @kind logic */
import type { BugReportFields } from '@drizztdourden08/brock-core';
import type { BugReportTargetFields } from './bug-report.type';
import { DEFAULT_ATTACHMENT_LIMITS } from './bug-report.constants';

const targetFields = ({ contact, attachments }: BugReportFields): BugReportTargetFields => ({
  contact: contact === true,
  attachments: attachments ? { ...DEFAULT_ATTACHMENT_LIMITS, ...(attachments === true ? {} : attachments) } : null,
});

export { targetFields };
