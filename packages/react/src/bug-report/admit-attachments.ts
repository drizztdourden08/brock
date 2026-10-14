/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import type { BugReportAttachmentLimits } from '@drizztdourden08/brock-core';
import type { AttachmentAdmission, SizedFile } from './bug-report.type';

const admitAttachments = <F extends SizedFile>(current: readonly SizedFile[], incoming: readonly F[], limits: BugReportAttachmentLimits): AttachmentAdmission<F> => {
  const admitted: F[] = [];
  let count = current.length;
  let bytes = current.reduce((total, file) => total + file.size, 0);
  let refused: string | null = null;
  for (const file of incoming) {
    if (count >= limits.maxFiles) {
      refused = `Up to ${limits.maxFiles} files can be attached.`;
      break;
    }
    if (bytes + file.size > limits.maxBytes) {
      refused = `${file.name} is too large: the files together can take up to ${formatBytes(limits.maxBytes)}.`;
      continue;
    }
    admitted.push(file);
    count += 1;
    bytes += file.size;
  }
  return { admitted, refused };
};

export { admitAttachments };
