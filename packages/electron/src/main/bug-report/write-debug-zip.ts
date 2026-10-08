/* @layer electron-main @kind logic */
import { readFile } from 'fs/promises';
import type { BugReportPayload } from '@drizztdourden08/brock-core/types';
import type { DebugZipEntry } from './bug-report.type';
import { LOGS_FOLDER, REPORT_ENTRY } from './bug-report.constants';
import { collectDebugFiles } from './collect-debug-files';
import { createZipWriter } from '../storage/zip/create-zip-writer';

const writeDebugZip = async (target: string, debugDir: string, payload: BugReportPayload, extras: readonly DebugZipEntry[] = []): Promise<string> => {
  const zip = await createZipWriter(target);
  try {
    await zip.add(REPORT_ENTRY, Buffer.from(JSON.stringify(payload, null, 2)));
    for (const file of await collectDebugFiles(debugDir)) {
      const data = await readFile(file.path).catch(() => null);
      if (data) await zip.add(`${LOGS_FOLDER}/${file.name}`, data);
    }
    for (const { name, data } of extras) await zip.add(name, typeof data === 'string' ? Buffer.from(data) : data);
    await zip.close();
  } catch (err) {
    await zip.abort();
    throw err;
  }
  return target;
};

export { writeDebugZip };
