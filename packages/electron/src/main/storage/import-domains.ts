/* @layer electron-main @kind logic */
import { cp, mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import type { DataImportResult } from '@drizztdourden08/brock-core/platform';
import { cleanDir } from './clean-dir';
import { resolveInside } from './resolve-inside';
import type { ImportRequest } from './transfer.type';
import { walkFiles } from './walk-files';
import { openZipReader } from './zip/open-zip-reader';

const fromZip = async (request: ImportRequest, id: string, dir: string): Promise<number> => {
  const zip = await openZipReader(request.from.source);
  try {
    const prefix = `${id}/`;
    const records = zip.records.filter((record) => record.name.startsWith(prefix) && !record.name.endsWith('/'));
    for (const [index, record] of records.entries()) {
      request.signal?.throwIfAborted();
      const full = resolveInside(dir, record.name.slice(prefix.length));
      await mkdir(dirname(full), { recursive: true });
      await writeFile(full, await zip.read(record));
      request.report?.(id, index + 1, records.length);
    }
    return records.length;
  } finally {
    await zip.close();
  }
};

const fromFolder = async (request: ImportRequest, id: string, dir: string): Promise<number> => {
  const source = resolveInside(request.from.source, id);
  const count = (await walkFiles(source)).length;
  await cp(source, dir, { recursive: true, force: true, verbatimSymlinks: true });
  request.report?.(id, count, count);
  return count;
};

const importDomains = async (request: ImportRequest): Promise<DataImportResult> => {
  const listed = new Set(request.from.manifest.domains.map((entry) => entry.domain));
  const known = new Set(request.domains.list().map((def) => def.domain));
  const chosen = request.ids.filter((id) => listed.has(id) && known.has(id));
  let files = 0;
  for (const id of chosen) {
    request.signal?.throwIfAborted();
    const dir = request.domains.domain(id).dir();
    await cleanDir(dir, null);
    await mkdir(dir, { recursive: true });
    files += await (request.from.format === 'zip' ? fromZip : fromFolder)(request, id, dir);
  }
  return { domains: chosen, files };
};

export { importDomains };
