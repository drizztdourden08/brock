/* @layer electron-main @kind logic */
import type { BugReportAttachment } from '@drizztdourden08/brock-core/types';
import type { DebugZipEntry } from './bug-report.type';
import { ATTACHMENTS_FOLDER } from './bug-report.constants';

const baseName = (name: string): string => {
  const last = name.split(/[\\/]/).pop();
  return last === undefined || last === '' ? 'file' : last;
};

const attachmentEntries = (attachments: readonly BugReportAttachment[]): DebugZipEntry[] => {
  const taken = new Set<string>();
  return attachments.map((attachment, index) => {
    const plain = baseName(attachment.name);
    const name = taken.has(plain) ? `${index + 1}-${plain}` : plain;
    taken.add(name);
    return { name: `${ATTACHMENTS_FOLDER}/${name}`, data: Buffer.from(attachment.data) };
  });
};

export { attachmentEntries };
