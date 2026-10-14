/* @layer renderer-shell @kind logic */
import type { BugReportAttachment } from '@drizztdourden08/brock-core';
import { formatBytes } from '@drizztdourden08/brock-core';
import type { BugReportAttachmentField } from './bug-report.type';
import type { AttachmentRead } from './bug-report-payload.type';

const readAttachments = async (files: readonly File[], held: readonly BugReportAttachment[], field: BugReportAttachmentField): Promise<AttachmentRead> => {
  const added: BugReportAttachment[] = [];
  const refused: string[] = [];
  for (const file of files) {
    if (held.length + added.length >= field.maxFiles) refused.push(`${file.name}: at most ${field.maxFiles} files`);
    else if (file.size > field.maxBytes) refused.push(`${file.name}: larger than ${formatBytes(field.maxBytes)}`);
    else added.push({ name: file.name, type: file.type || 'application/octet-stream', bytes: new Uint8Array(await file.arrayBuffer()) });
  }
  return { added, refused };
};

export { readAttachments };
