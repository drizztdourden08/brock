/* @layer electron-main @kind logic */
import type { BugReportPayload } from '@drizztdourden08/brock-core/types';
import type { DebugZipEntry, ZippedReport } from './bug-report.type';
import { ATTACHMENTS_FOLDER } from './bug-report.constants';

const safeName = (name: string, at: number): string => {
  const base = name.split(/[\\/]/).pop()?.replace(/[^\w.\- ]/g, '_') ?? '';
  return `${String(at + 1).padStart(2, '0')}-${base === '' ? 'file' : base}`;
};

const attachmentEntries = (payload: BugReportPayload): ZippedReport => {
  const attachments = payload.attachments ?? [];
  const files: DebugZipEntry[] = attachments.map((file, at) => ({ name: `${ATTACHMENTS_FOLDER}/${safeName(file.name, at)}`, data: Buffer.from(file.bytes) }));
  const listed = attachments.map((file, at) => ({ name: file.name, type: file.type, bytes: file.bytes.byteLength, file: files[at]?.name ?? '' }));
  const { attachments: _bytes, ...rest } = payload;
  return { report: attachments.length === 0 ? rest : { ...rest, attachments: listed }, files };
};

export { attachmentEntries };
