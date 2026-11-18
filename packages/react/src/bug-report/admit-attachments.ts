/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import type { BugReportAttachmentLimits } from '@drizztdourden08/brock-core';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { AttachmentAdmission, SizedFile } from './bug-report.type';

const admitAttachments = <F extends SizedFile>(current: readonly SizedFile[], incoming: readonly F[], limits: BugReportAttachmentLimits): AttachmentAdmission<F> => {
  const admitted: F[] = [];
  let count = current.length;
  let bytes = current.reduce((total, file) => total + file.size, 0);
  let refused: Text | null = null;
  for (const file of incoming) {
    if (count >= limits.maxFiles) {
      refused = msg('brock-app:bugReport.attach.tooMany', { count: limits.maxFiles });
      break;
    }
    if (bytes + file.size > limits.maxBytes) {
      refused = msg('brock-app:bugReport.attach.tooLarge', { name: file.name, size: formatBytes(limits.maxBytes) });
      continue;
    }
    admitted.push(file);
    count += 1;
    bytes += file.size;
  }
  return { admitted, refused };
};

export { admitAttachments };
